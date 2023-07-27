import {
  Animator,
  AudioSource,
  AvatarAnchorPointType,
  AvatarAttach,
  ColliderLayer,
  engine,
  GltfContainer,
  InputAction,
  inputSystem,
  Material,
  MeshCollider,
  PointerEvents,
  pointerEventsSystem,
  PointerEventType,
  Transform
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'

import { gunSystem, colorSystem } from './systems'

import { spawnGun } from './gun'

export function main() {
  const card = engine.getEntityOrNullByName('card.glb')
  if (card) {
    utils.perpetualMotions.startRotation(card, Quaternion.fromEulerDegrees(0, 15, 0))

    utils.triggers.addTrigger(card, 1, 1, [{ type: 'box' }], () => {
      const cardTransform = Transform.getMutable(card)
      cardTransform.scale = Vector3.Zero()
      AudioSource.createOrReplace(card, { audioClipUrl: 'sounds/cardPickup.mp3', playing: true, loop: false })
    })
  }

  const gun = engine.getEntityOrNullByName('portalGun.glb')
  if (gun) {
    spawnGun(gun)
  }

  // add colliders
  const walls = engine.getEntityOrNullByName('walls.glb')
  if (walls) {
    PointerEvents.create(walls, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            showFeedback: false,
            maxDistance: 15
          }
        }
      ]
    })
  }

  // add colliders
  const floor = engine.getEntityOrNullByName('baseLight.glb')
  if (floor) {
    PointerEvents.create(floor, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            showFeedback: false,
            maxDistance: 15
          }
        }
      ]
    })
  }

  engine.addSystem(gunSystem)
  engine.addSystem(colorSystem)
}