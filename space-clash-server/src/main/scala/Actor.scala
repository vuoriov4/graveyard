import scala.collection.mutable.ArrayBuffer

abstract class Actor(name: String) {
    val entities = ArrayBuffer[Entity]()
    def evolve(session: Session): Unit = {
        entities.foreach(x => x.evolve(session))
    }
    def addEntity(e: Entity): Unit = {
        entities.append(e)
    }
    def toDTO: ActorDTO = {
        return ActorDTO(name, entities.map(x => x.toDTO()))
    }
}
