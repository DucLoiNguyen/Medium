function route(app) {
  app.get("/api/", (req, res) => {
    res.json({
      hello: "world",
    });
  });
}

export default route;