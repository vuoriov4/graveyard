import scala.math._
object Math {
    def normalize(p: (Double, Double, Double)) = {
        val s = sqrt(p._1 * p._1 + p._2 * p._2 + p._3 * p._3)
        (p._1 / s, p._2 / s, p._3 / s)
    }
}
