import Hunt1 from "./Hunt1"
import King1 from "./King1"
import Martial1 from "./Martial1"
import Warrior1 from "./Warrior1"
import Warrior3 from "./Warrior3"

export default class CharacterFactory {
    constructor (character, w, h) {
        this.character = character
        this.width = w
        this.height = h
    }

    create() {
        switch(this.character) {
            case 'warrior1':
                return new Warrior1(this.width,this.height)
            case 'warrior3':
                return new Warrior3(this.width, this.height)
            case 'hunt1':
                return new Hunt1(this.width, this.height)
            case 'king1':
                return new King1(this.width, this.height)
            case 'martial1':
                return new Martial1(this.width, this.height)
                
        }
    }
}