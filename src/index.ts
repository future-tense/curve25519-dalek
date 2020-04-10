
import secureRandom from 'secure-random';
import { scalar, edwards }  from '@futuretense/dalek-crypto';

export class Scalar {

    constructor(public s: Buffer) {
        this.s = s;
    }

    add(x: Scalar): Scalar {
        return new Scalar(scalar.add(this.s, x.toBuffer()));
    }

    sub(x: Scalar): Scalar {
        return new Scalar(scalar.sub(this.s, x.toBuffer()));
    }

    mul(x: Scalar): Scalar {
        return new Scalar(scalar.mul(this.s, x.toBuffer()));
    }

    inverse(): Scalar {
        return new Scalar(scalar.inverse(this.s))
    }

    copy(): Scalar {
        return new Scalar(this.s);
    }

    static copy(s: Scalar): Scalar {
        return new Scalar(s.s);
    }

    toBuffer(): Buffer {
        return this.s;
    }

    static fromBuffer(buf: Buffer): Scalar {
        return new Scalar(buf);
    }

    static fromHash(...args: Buffer[]): Scalar {
        return new Scalar(scalar.fromHash(...args));
    }

    static random(): Scalar {
        const sk = secureRandom(32, {type: 'Buffer'});
        return Scalar.fromBuffer(sk);
    }

    equals(s: Scalar): boolean {
        return Buffer.compare(this.s, s.s) === 0;
    }
}

export class Point {

    constructor(public p: Buffer) {
        this.p = p;
    }

    add(p: Point): Point {
        return new Point(edwards.add(this.p, p.p));
    }

    sub(p: Point): Point {
        return new Point(edwards.sub(this.p, p.p));
    }

    mul(s: Scalar): Point {
        return new Point(edwards.mul(s.s, this.p));
    }

    copy(): Point {
        return new Point(this.p);
    }

    static copy(p: Point): Point {
        return new Point(p.p);
    }

    static mul(s: Scalar): Point {
        return new Point(edwards.mulbp(s.s));
    }

    toBuffer(): Buffer {
        return this.p;
    }

    static fromBuffer(buf: Buffer): Point {
        return new Point(buf);
    }

    equals(other: Point): boolean {
        return Buffer.compare(this.p, other.p) === 0;
    }
}

export const curve = {
    basepoint: new Point(edwards.basepoint),
    pointFromBuffer: (buf: Buffer): Point => Point.fromBuffer(buf),
    randomScalar: (): Scalar => Scalar.random(),
    scalarFromBuffer: (buf: Buffer): Scalar => Scalar.fromBuffer(buf),
    scalarFromHash: (...args: Buffer[]): Scalar => Scalar.fromHash(...args)
};
