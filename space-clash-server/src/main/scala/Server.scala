import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.http.scaladsl.server.Directives._
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Flow

import scala.io.StdIn

object Server extends App {
    // Start session system
    SessionHandler.addSession()
    SessionHandler.start()
    // Start server
    implicit val actorSystem = ActorSystem("akka-system")
    implicit val flowMaterializer = ActorMaterializer()
    val interface = "localhost"
    val port = 8080
    val route = SessionService.route ~ MenuService.route
    val binding = Http().bindAndHandle(route, interface, port)
    println(s"Server is now online at http://$interface:$port\nPress RETURN to stop...")
    StdIn.readLine()
    import actorSystem.dispatcher
    binding.flatMap(_.unbind()).onComplete(_ => actorSystem.shutdown())
    println("Server crashed :(")
}