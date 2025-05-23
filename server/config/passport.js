 
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const lecturer = await db.Lecturer.findByPk(jwt_payload.lecturer_id);
    if (lecturer) {
      return done(null, lecturer); // becomes req.lecturer
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}));