import akka.actor.ActorSystem

import scala.collection.mutable.ArrayBuffer
import scala.concurrent.duration._

object SessionHandler {
    val sessions = ArrayBuffer[Session]()
    def addSession() = {
        val player = new Player("Rookie")
        val opponent = new Bot("TotallyHuman")
        val session = new Session(player, opponent)
        player.entities.append(new Base((0, 0, -10), session))
        opponent.entities.append(new Base((0, 0, 10), session))
        sessions.append(session)
    }
    def start(): Unit = {
        val system = ActorSystem("session-system")
        import system.dispatcher
        system.scheduler.schedule(0 seconds, Constants.EVOLVE_DELAY) {
            sessions.foreach(s => {
                s.evolve();
            });
        }
    }
}
