/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
import React, { useState, useEffect, useMemo } from 'react';
import { MdNotifications } from 'react-icons/md';
import { parseISO, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';
import api from '~/services/api';
import history from '~/services/history';
import {
  Container,
  Badge,
  NotificationList,
  Scroll,
  Notification,
} from './styles';

export default function Notifications() {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const hasUnread = useMemo(
    () => !!notifications.find(notification => notification.read === false),
    [notifications]
  );

  useEffect(() => {
    async function loadNotifications() {
      const response = await api.get('notifications');
      const data = response.data.map(notification => ({
        ...notification,
        timeDistance: formatDistance(
          parseISO(notification.createdAt),
          new Date(),
          {
            addSuffix: true,
            locale: pt,
          }
        ),
      }));

      setNotifications(data);
    }

    loadNotifications();
  }, []);

  async function handleMarkAsRead(id) {
    await api.put(`notifications/${id}`);

    setNotifications(
      notifications.map(notification =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  }

  function handleToggleVisible() {
    setVisible(!visible);
  }
  function handleLink(to)
  {
    setVisible(false);
    history.push(`/${to}`);
  }

  return (
    <Container>
      <Badge onClick={handleToggleVisible} hasUnread={hasUnread}>
        <MdNotifications color="#7159c1" size={20} />
      </Badge>
      <NotificationList visible={visible}>
        <Scroll>
          {notifications.map(notification => (
            <Notification unread={!notification.read} key={notification._id}>
              <div>
                <button type="button"  className="mensagem" onClick={() => handleLink(notification.link)}>{notification.content}</button>               
                <div>
                  <time>{notification.timeDistance}</time>
                  {!notification.read && (
                    <button
                      type="button"
                      className="lida"
                      onClick={() => handleMarkAsRead(notification._id)}
                    >
                      Marcar como lida
                    </button>
                  )}
                </div>
              </div>
              <canvas />
            </Notification>
          ))}
        </Scroll>
      </NotificationList>
    </Container>
  );
}
