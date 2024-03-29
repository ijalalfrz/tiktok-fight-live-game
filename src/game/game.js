import Phaser from 'phaser'
import BootScene from '@/game/scenes/BootScene'
import PlayScene from '@/game/scenes/PlayScene'
import WinScene from '@/game/scenes/WinScene'
import PauseScene from '@/game/scenes/PauseScene'
import LoseScene from '@/game/scenes/LoseScene'


function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: containerId,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 1500 },
        debug: true,
        overlapBias: 60,
        tileBias: 30,
        fps: 60,
        fixedStep: true
      }
    },
    scene: [BootScene, PlayScene,WinScene,PauseScene,LoseScene]
  })
}

export default launch
export { launch }
