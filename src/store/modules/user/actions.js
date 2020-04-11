export function updateProfileRequest(data) {
  return {
    type: '@user/UPDATE_PROFILE_REQUEST',
    payload: { data },
  };
}
export function updateProfileSuccess(profile) {
  return {
    type: '@user/UPDATE_PROFILE_SUCCESS',
    payload: { profile },
  };
}

export function updateProfileAvatar(avatar) {
  return {
    type: '@user/UPDATE_PROFILE_AVATAR_SUCCESS',
    
    payload: { avatar },
  };
}

export function updateProfileFailure() {
  return {
    type: '@user/UPDATE_PROFILE_REQUEST',
  };
}
