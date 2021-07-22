abstract class Projectile(var position: (Double, Double, Double), var target: (Double, Double, Double)) {
    var speed: Double
    def evolve(session: Session): Unit
}
