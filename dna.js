class Matrix {
    rows = []
    MAX_REPETITIONS = 4;
    constructor(dna, isMatrix=false) {
        if (isMatrix) {
            this.rows = dna;
            return;
        }
        for (let i = 0; i < dna.length; i += 1) {
            const cols = [];
            for (let j = 0; j < dna[i].length; j += 1) {
                cols.push(dna[i][j]);
            }
            this.rows.push(cols);
        }
    }

    prettyPrint() {
        //console.log(this.rows);
    }

    transpose() {
        for (let i = 0; i < this.rows.length; i += 1) {
            for (let j = 0; j < this.rows[i].length; j += 1) {
                if (i === j) {
                    break;
                }
                [this.rows[i][j], this.rows[j][i]] = [this.rows[j][i], this.rows[i][j]];
            }
        }
    }

    rotate(anti=false) {
        const newMatrix = [];
        if (anti) {
            for (let j = 0; j < this.rows.length; j += 1) {
                const newRow = [];
                for (let i = this.rows.length - 1; i >= 0 ; i -= 1) {
                    newRow.push(this.rows[i][j]);
                }
                newMatrix.push(newRow);
            }
        } else {
            for (let j = this.rows.length - 1; j >= 0 ; j -= 1) {
                const newRow = []
                for (let i = 0; i < this.rows.length; i += 1) {
                    newRow.push(this.rows[i][j]);
                }
                newMatrix.push(newRow);
            }
        }
        this.rows = newMatrix;
    }

    completeObliqueDown(row, col) {
        const newLine = [];
        while (true) {
            newLine.push(this.rows[row][col]);
            row += 1;
            col += 1;
            if (row === this.rows.length || col === this.rows.length) {
                return newLine;
            }
        }
    }

    oblique() {
        const newRows1 = [];
        for (let i = this.rows.length - this.MAX_REPETITIONS; i >= 0; i -= 1) {
            newRows1.push(this.completeObliqueDown(i, 0));
        }
        for (let j = 1; j <= this.rows[0].length - this.MAX_REPETITIONS; j += 1) {
            newRows1.push(this.completeObliqueDown(0, j));
        }
        this.rotate();
        const newRows2 = [];
        for (let i = this.rows.length - this.MAX_REPETITIONS; i >= 0; i -= 1) {
            newRows2.push(this.completeObliqueDown(i, 0));
        }
        for (let j = 1; j <= this.rows[0].length - this.MAX_REPETITIONS; j += 1) {
            newRows2.push(this.completeObliqueDown(0, j));
        }
        this.rotate(true);
        return [new Matrix(newRows1, true), new Matrix(newRows2, true)]
    }

    findMutationsHorizontal() {
        for (let i = 0; i < this.rows.length; i += 1) {
            let previousVal = this.rows[i][0];
            let currentRepetitions = 1;
            for (let j = 1; j < this.rows[i].length; j += 1) {
                if (previousVal === this.rows[i][j]) {
                    currentRepetitions += 1;
                    if (currentRepetitions === this.MAX_REPETITIONS) {
                        //console.log(`row=${i+1}, col=${j+1}, item=${previousVal}`);
                        return true;
                    }
                } else {
                    currentRepetitions = 1;
                }
                previousVal = this.rows[i][j];
            }
        }
        return false;
    }
}

export default function hasMutation(dna) {
    let matrix = new Matrix(dna);
    let [m1, m2] = matrix.oblique();
    matrix.prettyPrint();
    if (matrix.findMutationsHorizontal()) {
        //console.log('horizonal mutation found');
        return true;
    }
    matrix.transpose();
    if (matrix.findMutationsHorizontal()) {
        //console.log('vertical mutation found');
        return true;
    }
    if (m1.findMutationsHorizontal() || m2.findMutationsHorizontal()) {
        m1.prettyPrint();
        m2.prettyPrint();
        //console.log('oblique mutation found');
        return true;
    }
    return false;
}