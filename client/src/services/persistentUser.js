const getUser = () => {
  const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser');
  return JSON.parse(loggedUserJson);
};

const saveUser = (user) => {
  window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
};

const removeUser = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
}

export default { getUser, saveUser, removeUser}
