class Session(val player: Actor, val opponent: Actor) {
    var time: Double = 0
    def evolve() {
        player.evolve(this)
        opponent.evolve(this)
        time += Constants.EVOLVE_DELAY.toMillis / 1000.0
    }
    def toDTO(): SessionDTO = {
        return SessionDTO(time, player.toDTO, opponent.toDTO)
    }
}