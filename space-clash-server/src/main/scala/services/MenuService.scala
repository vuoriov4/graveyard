import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.scaladsl.Flow
import io.circe.syntax._
import io.circe.generic.auto._

object MenuService {

    def route: Route = path("menu") {
        get {
            handleWebSocketMessages(menuService)
        }
    }

    val menuService: Flow[Message, Message, _] = Flow[Message].map {
        case TextMessage.Strict(payload) => TextMessage("OK")
        case _ => TextMessage("Message type unsupported")
    }
}