import { describe, expect, it } from "@jest/globals"
import { Pendulum } from "../pendulum"

describe("Pendulum", () => {
    it("should create a pendulum instance", () => {
        const pendulum = new Pendulum()
        expect(pendulum).toBeInstanceOf(Pendulum)
        expect(pendulum.id).toBeDefined()
    })

    it("pendulum bob position should be initialized according to the initial angle", () => {
        const angle45 = Math.PI / 4
        const origin = { x: 0, y: 0 }
        const pendulum = new Pendulum({
            origin,
            initialAngle: angle45
        })
        expect(Math.floor(pendulum.bob.x)).toBe(70)
        expect(Math.floor(pendulum.bob.y)).toBe(70)
    })

    it("pendulum bob position should be updated according to the angle", () => {
        const angle45 = Math.PI / 4
        const angle90 = Math.PI / 2

        const origin = { x: 0, y: 0 }
        const pendulum = new Pendulum({
            origin,
            initialAngle: angle45
        })

        // Pendulum with angle 45 degrees should have bob positioned at (70, 70)
        expect(Math.floor(pendulum.bob.x)).toBe(70)
        expect(Math.floor(pendulum.bob.y)).toBe(70)

        pendulum.setAngle(angle90)

        // Pendulum with angle 90 degrees should have bob positioned at (100, 0)
        expect(Math.floor(pendulum.bob.x)).toBe(100)
        expect(Math.floor(pendulum.bob.y)).toBe(0)
    })

    it("should move pendulum applying physics", () => {
        const options = {
            gravity: 9.81,
        }
        const pendulum = new Pendulum({
            initialAngle: Math.PI / 4,
            armLength: 100,
            origin: { x: 0, y: 0 }
        })

        // Pendulum with angle 45 degrees should have bob positioned at (70, 70)
        expect(Math.floor(pendulum.bob.x)).toBe(70)

        pendulum.move(options)

        // After moving the pendulum, the bob should be at a different position
        expect(Math.floor(pendulum.bob.x)).toBeLessThan(70)
    })

    it("should move pendulum further when the mass is increased", () => {
        const options = {
            gravity: 9.81,
        }
        const pendulumWithDefaultMass = new Pendulum({
            initialAngle: Math.PI / 4,
            armLength: 100,
            origin: { x: 0, y: 0 },
        })

        const pendulumWithHigherMass = new Pendulum({
            initialAngle: Math.PI / 4,
            armLength: 100,
            origin: { x: 0, y: 0 },
            mass: 2
        })

        pendulumWithDefaultMass.move(options)
        pendulumWithHigherMass.move(options)

        // Pendulum with higher mass should have moved further
        // @ts-ignore
        expect(pendulumWithHigherMass.bob.x).toBeLessThan(pendulumWithDefaultMass.bob.x)
    })

    it("should move pendulum and reset position", () => {
        const pendulum = new Pendulum({
            initialAngle: Math.PI / 4,
            armLength: 100,
            origin: { x: 0, y: 0 }
        })

        const initialBobPosition = {
            x: pendulum.bob.x,
            y: pendulum.bob.y
        }

        pendulum.move({ gravity: 9.81 })
        pendulum.move({ gravity: 9.81 })
        pendulum.move({ gravity: 9.81 })

        expect(pendulum.bob.x).toBeLessThan(initialBobPosition.x)
        expect(pendulum.bob.y).toBeGreaterThan(initialBobPosition.y)

        pendulum.resetPosition()

        expect(pendulum.bob.x).toBe(initialBobPosition.x)
        expect(pendulum.bob.y).toBe(initialBobPosition.y)
    })
})
