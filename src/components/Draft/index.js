/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
} from 'react-icons/md';
import './styles.css';

class PageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      currentContent: null,
    };
  }

  onChange = editorState => {
    this.setState({
      editorState,
      currentContent: editorState.getCurrentContent(),
    });
  };

  handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  onUnderlineClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE')
    );
  };

  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  };

  onItalicClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC')
    );
  };

  render() {
    return (
      <div className="editorContainer">
        <div className="buttons">
          <button type="button" onClick={this.onUnderlineClick}>
            <MdFormatUnderlined />
          </button>
          <button type="button" onClick={this.onBoldClick}>
            <b>
              <MdFormatBold />
            </b>
          </button>
          <button type="button" onClick={this.onItalicClick}>
            <em>
              <MdFormatItalic />
            </em>
          </button>
        </div>{' '}
        <div className="editors">
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

export default PageContainer;
