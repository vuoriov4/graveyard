import scala.collection.mutable.ArrayBuffer

abstract class Entity(var position: (Double, Double, Double) = (0, 0, 0), val session: Session) {
    val name: String
    val speed: Double
    def velocity(session: Session): (Double, Double, Double)
    var time: Double = 0
    def projectiles = ArrayBuffer[Projectile] ()
    def evolve(session: Session)
    def emit(projectile: Projectile) = {
        projectiles.append(projectile)
    }
    def toDTO(): EntityDTO = {
        return EntityDTO(position, velocity(session), name)
    }
}
