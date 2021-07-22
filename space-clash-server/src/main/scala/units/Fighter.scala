class Fighter(p0: (Double, Double, Double) = (0, 0, 0), session: Session) extends Entity(p0, session) {
    val name = "Fighter"
    val speed = 5.0;
    def velocity(session: Session): (Double, Double, Double) = {
        val target = session.player.entities.apply(0)
        if (target == this) return (0, 0, 0)
        val dir = Math.normalize((target.position._1 - position._1, target.position._2 - position._2, target.position._3 - position._3 ))
        (speed * dir._1, speed * dir._2, speed * dir._3)
    }
    def evolve(session: Session) {
        val v = velocity(session)
        position = (
            position._1 + v._1 * Constants.EVOLVE_DELAY.toMillis / 1000.0,
            position._2 + v._2 * Constants.EVOLVE_DELAY.toMillis / 1000.0,
            position._3 + v._3 * Constants.EVOLVE_DELAY.toMillis / 1000.0
        )
        time += Constants.EVOLVE_DELAY.toSeconds
    }
}


