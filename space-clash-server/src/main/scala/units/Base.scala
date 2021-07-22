class Base(p0: (Double, Double, Double) = (0, 0, 0), session: Session) extends Entity(p0, session) {
    val name = "Base"
    val speed = 1.0;
    def velocity(session: Session): (Double, Double, Double) = (0, 0, 0)
    def evolve(session: Session) {
        time += Constants.EVOLVE_DELAY.toMillis / 1000.0
    }
}


