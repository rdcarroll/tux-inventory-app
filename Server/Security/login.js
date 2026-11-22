module.exports = (router, app, authenticator) => {
  router.post("/register", authenticator.registerUser);
  router.post("/update", authenticator.updateUser);
  router.post("/login", app.oauth.grant(), authenticator.login);
  router.post("/requestreset", authenticator.requestReset);

  return router;
};