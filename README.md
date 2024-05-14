Space Invaders Read Me


Description
A pokemon themed space invaders game browser game. This was completed in the 3rd week of my coding journey with General Assembly software engineering immersive course. This project's goal was to create a grid that could interact with moving objects, both human and computed through the use of JavaScript.


Deployment link
https://kiwicj.github.io/Unit1_Project_SpaceInvadors/


Timeframe
Solo - 7 day project


Technologies Used
HTML
CSS
JavaScript


Brief
The player should be able to clear at least one wave of aliens
The player's score should be displayed at the end of the game
The player can only move left or right
The aliens also move from left to right, and also down each time the reach the side of the screen
The aliens also periodically drop bombs towards the player.








Planning

Create board - HTML, CSS, and JS 
Implement game loop - Init function, create grid.
Create player - Pull in the sprite. keyboard controlled (A/D & L/R arrows. Space to shoot)  Player cannot move any further than the grid itself. 
Create enemy - Pull in the sprite, and create an array of enemies. Automatically move a specific pattern on game start, shoot from a random location where the enemy is present. 
Detect collision - Everytime player bullets collide with an enemy, remove 1 enemy from the array. If an enemy bullet hits the player, end the game.  		
Scoring - Tally for every enemy destroyed/removed.
	


Build/Code Process

I started off within my board creating a grid.
function createGrid() {
       for (let i = 0; i < cellCount; i++) {
           const cell = document.createElement('div')
           cell.dataset.index = i
           cell.style.height = `${100 / height}%`
           cell.style.width = `${100 / width}%`
           grid.appendChild(cell)
           cells.push(cell)
       }
       addPlayer(startingPosition)
       addEnemies()
       handleEnemyMovement()
}


From there, I needed to place my player into its starting location, ensuring an odd number of grid locations being used so that there was a true center point. The player then needed to be added and removed upon keystroke to go either left or right. 

I then added in my enemies starting location. Then went through and populated the array to give the enemies their locations. I then made the enemies move in the pattern, right to the right wall, then down one grid place, then left to the left wall and down one. This was to continue all the way down the board. With the game ending if an enemy hits the bottom of the grid. 

function handleEnemyMovement() {
   let moveRight = true




   function moveEnemies() {
       enemyPositions.forEach(position => {
           cells[position].classList.remove('enemy')
       });
      
       let moveDown = false
       let farRight = 0
       let farRightIndex


       // check enemy positions for right wall index
       enemyPositions.forEach((position, index) => {
          if (position % width > farRight) {
           farRight = position % width
           farRightIndex = index
          }
       })


       // Check if the entire group hits the right or left wall
       if (moveRight && enemyPositions[farRightIndex] % width === width - 1) {
           moveDown = true
       } else if (!moveRight && enemyPositions[0] % width === 0) {
           moveDown = true
       }
      
       if (moveDown) {
           // Move down after hitting the right or left wall
           for (let i = 0; i < enemyPositions.length; i++) {
               enemyPositions[i] += width
           }
           moveRight = !moveRight // Change direction after moving down
       } else {
           // Move to the right or left
           for (let i = 0; i < enemyPositions.length; i++) {
               enemyPositions[i] += moveRight ? 1 : -1
           }
       }


       enemyPositions.forEach(position => {
           cells[position].classList.add('enemy')


           // Check if enemy is hit by the player bullet
           const hitByBullet = cells[position].classList.contains('player-bullet')
           if (hitByBullet) {
               cells[position].classList.remove('enemy')
               const enemyIndex = enemyPositions.indexOf(position)
               enemyPositions.splice(enemyIndex, 1)
           }



Both the player and enemy needed to be able to shoot, for the player up the grid and for the enemies down the grid.  For the player, I needed to remove one enemy if the bullet collided with one, all whilst not breaking the formation or the movement of the enemies. I achieved this with a combination of the above and below code.

function addBullet(position, index) {
   const playerBullet = document.createElement('div')
   playerBullet.classList.add('player-bullet')
   cells[position].appendChild(playerBullet)


   const bulletInterval = setInterval(() => {
       // check if bullet still on grid
       if (position >= width) {
           cells[position].removeChild(playerBullet)
           position -= width
           cells[position].appendChild(playerBullet)


           //check collision with enemy
           const enemiesInColumn = enemyPositions.filter(enemyPos => enemyPos % width === index)
           if (enemiesInColumn.length > 0 && enemiesInColumn.includes(position)  ) {
               const targetEnemyPosition = enemiesInColumn[enemiesInColumn.length -1]
               const targetEnemyIndex = enemyPositions.indexOf(targetEnemyPosition)
            
               //remove enemy if hit
               cells[targetEnemyPosition].classList.remove('enemy')
               enemyPositions.splice(targetEnemyIndex, 1)
               clearInterval(bulletInterval)
               cells[position].removeChild(playerBullet)


               score += 10
              
           }


       } else {
           // remove bullet if off grid
           cells[position].removeChild(playerBullet)
           clearInterval(bulletInterval)
       }


   }, 100) // speed of bullet


   PlayerShootSound()
}

Now, I needed the enemies to shoot from a location where there was an enemy present within the grid. 

function handleEnemyShoot(enemyPosition) {
   const enemyBullet = document.createElement('div') // create bullet
   enemyBullet.classList.add('enemy-bullet')
  
   let bulletPosition = enemyPosition


   cells[bulletPosition].appendChild(enemyBullet)
   const bulletInterval = setInterval(() => {
       //check if bullet is still on the grid
       if (cells[bulletPosition].contains(enemyBullet)) {
       cells[bulletPosition].removeChild(enemyBullet)
       }


       bulletPosition += width


       // checking if bullet hits player
       if (bulletPosition === currentPosition) {
           console.log('Player Hit!');
           handleLose()
       }


       if (bulletPosition < cellCount) {
           cells[bulletPosition].appendChild(enemyBullet)
       } else {
           clearInterval(bulletInterval)
       }
   }, 250) // enemy bullet speed


   EnemyShootSound()
}

Scoring was then implemented so that you would get 10 points per enemy destroyed, along with the end game function to stop the player from playing and to show the score of what they last got. This would then refresh upon click of the play now button, and the message would change back to “Don't get caught.” 


Challenges
Throughout this project, I faced a few challenges. 
The main one would be the enemy movement upon being hit by a player's bullet. The characteristics of them would change not only per column but also the overall movement of them. 
Upon digging my code and trying to fix it in multiple locations, I finally found a solution, as I was calling the enemies in multiple locations. Once removed I needed to ensure the enemies would only move down if an enemy would hit the left or the right wall, regardless of that row and column they are on. As their starting locations were indicated using the leftmost location, the left wall was not an issue, however for the right wall I used this - 
let farRight = 0
let farRightIndex


       // check enemy positions for right wall index
       enemyPositions.forEach((position, index) => {
          if (position % width > farRight) {
           farRight = position % width
           farRightIndex = index
          }
       })



Wins
The recent progress I made was truly rewarding! While it did require a significant time investment and involved some complexity as I navigated through my code, it ultimately led to a breakthrough in solving one of the issues I encountered.
I was also proud to get the enemies to drop bullets from a random position of their current locations. 
Key Learnings/Takeaways
Being my first project, this was all one big learning curve for me. Here I learned how to implement keystrokes to move, getting things to move on their own, not letting players and enemies move to positions that are located off the given grid. 

If I were to try this again, I would create an object of the enemies, to hold a value to display the enemies. From there, I think the movement and shooting methods would be easier to manage and alter as needed. 


Bugs
There is currently a bug where upon clicking the ‘let's play’ button after losing a game, the message will randomly get updated to show you lost, even though the game will continue to run. 


Future Improvements
Here I would like to implement a locally stored leaderboard. I would also like to make the game get progressively harder as you clear the levels. This is why there is no " you win" function, as I want the game to continue until the game is over. 
