let mutation_rate=2;
class Vehicle {
   
    constructor(x, y, dna) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, -2);
        this.position = createVector(x, y);
        this.r = 4;
        this.maxspeed = 5;
        this.maxforce = 0.5;
        this.dna = [];
        this.reproduction_chance=0.005;
        if (dna == undefined) {

            //food dna
            this.dna[0] = random(-2, 2);
            //poison dna
            this.dna[1] = random(-2, 2);
            //range of sight for food
            this.dna[2] = random(10, 100);
            //ramge of sight for poison
            this.dna[3] = random(10, 100);
        } else {
            if(random(1)<mutation_rate){
                this.dna[0] = dna[0]+random(-0.1,0.1);
            } else{
                this.dna[0] = dna[0];
            }
            if(random(1)<mutation_rate){
                this.dna[1] = dna[1]+random(-0.1,0.1);
            }else{
                this.dna[1] = dna[1];
            }
            if(random(1)<mutation_rate){
                this.dna[2] = dna[2]+random(-10,10);
            }else{
                this.dna[2] = dna[2];
            }
            if(random(1)<mutation_rate){
                this.dna[3] = dna[3]+random(-10,10);
            }else{
                this.dna[3] = dna[3];
            }
           
           
        }
        this.health = 1;
    }

    // Method to update location
    update() {
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelerationelertion to 0 each cycle
        this.acceleration.mult(0);
        //decrease Health Over Time
        this.health -= 0.01;
    }

    applyForce(force) {
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    }


    behaviours(good, bad) {
        let steerG = this.eat(good, 0.3, this.dna[2]);
        let steerB = this.eat(bad, -0.8, this.dna[3]);
        steerG.mult(this.dna[0]);
        steerB.mult(this.dna[1]);
        this.applyForce(steerG);
        this.applyForce(steerB);
    }

    // A method that calculates a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek(target) {

        var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

        // Scale to maximum speed
        desired.setMag(this.maxspeed);

        // Steering = Desired minus velocity
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); // Limit to maximum steering force

        return steer;
    }

    eat(list, nutrition, perception) {
        let record = Infinity;
        let closest = null;
        for (let i = list.length - 1; i >= 0; i--) {

            let d = this.position.dist(list[i]);
            if (d < this.maxspeed) {
                list.splice(i, 1);
                this.health += nutrition;

            } else {
                if (d < record && d < perception) {
                    record = d;
                    closest = list[i];
                }
            }
        }
        if (closest != null) {
            return this.seek(closest);
        }

        return createVector(0, 0);

    }

    boundaries() {

        let desired = null;
        let d = 25;
        if (this.position.x < d) {
            desired = createVector(this.maxspeed, this.velocity.y);
        } else if (this.position.x > width - d) {
            desired = createVector(-this.maxspeed, this.velocity.y);
        }

        if (this.position.y < d) {
            desired = createVector(this.velocity.x, this.maxspeed);
        } else if (this.position.y > height - d) {
            desired = createVector(this.velocity.x, -this.maxspeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxspeed);
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
    }

    clone() {
        if (random(1) <this.reproduction_chance) {
            return new Vehicle(this.position.x, this.position.y, this.dna);
        } else {
            return null;
        }
    }

    display() {
        // Draw a triangle rotated in the direction of velocity
        let angle = this.velocity.heading() + PI / 2;





        push();
        translate(this.position.x, this.position.y);
        rotate(angle);


        if (debug == true) {
            //displaying food weights
            strokeWeight(3);
            stroke(0, 255, 0);
            noFill();
            line(0, 0, 0, -this.dna[0] * 20);
            ellipse(0, 0, this.dna[2] * 2);
            //displaying poison weights
            strokeWeight(2);
            stroke(255, 0, 0);
            line(0, 0, 0, -this.dna[1] * 20);
            ellipse(0, 0, this.dna[3] * 2);
        }


        //displaying the organism
        var col = lerpColor(color(255, 0, 0), color(0, 255, 0), this.health);
        fill(col);
        stroke(col);
        strokeWeight(1);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();
    }


    dead() {
        return (this.health < 0);
    }
}