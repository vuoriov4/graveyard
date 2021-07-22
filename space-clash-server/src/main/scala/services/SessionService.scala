import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.scaladsl.Flow
import io.circe.syntax._
import io.circe.generic.auto._
import io.circe.parser._

object SessionService {

    def route: Route = path("session") {
        get {
            handleWebSocketMessages(sessionService)
        }
    }

    val sessionService: Flow[Message, Message, _] = Flow[Message].map {
        case TextMessage.Strict(payload) =>
            val parseResult = parse(payload)
            val session = SessionHandler.sessions.head;
            parseResult match {
                case Right(json) => json.asObject.get.apply("id").get.asString.get match {
                    case "none" =>
                        // Do nothing
                    case "mouseup" =>
                        // Add unit
                        val x = json.asObject.get.apply("x").get.asNumber.get.toDouble
                        val y = json.asObject.get.apply("y").get.asNumber.get.toDouble
                        val z = json.asObject.get.apply("z").get.asNumber.get.toDouble
                        val name = json.asObject.get.apply("name").get.asString.get
                        val f = new Fighter((x, y, z), session)
                        session.player.addEntity(f)
                }
                case Left(error) =>
                    // Error handling
            }
            TextMessage(session.toDTO().asJson.toString())
        case _ => TextMessage("Message type unsupported")
    }
}