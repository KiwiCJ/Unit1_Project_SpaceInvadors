
function init() {

//!ELEMENTS
const grid = document.querySelector('.board .grid')
// const startButton = document.querySelector('.startButton')


//! VARIABLES 

// grid
const width = 15
const height = 15
const cellCount = width * height
let cells = []

//player
const startingPosition = 217
let currentPosition = startingPosition
let score = 0

//enemy
const enemyStartPosition = [18, 33, 48]
let enemiesPerRow = 9
let totalRows = 3
let enemyPositions = []
let enemyMovementInterval

//! FUNCITONS

function createGrid() {
    grid.innerHTML = ''

        for (let i = 0; i < cellCount; i++) {
            const cell = document.createElement('div')
            //cell.innerText = i // remove this to remove numbers from grid 
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




function addPlayer(position) {
    cells[position].classList.add('player')
}


function removePlayer() {
    cells[currentPosition].classList.remove('player')
}



function addEnemies() {
    for (let row = 0; row < totalRows; row++) {
        for (let i = 0; i < enemiesPerRow; i++) {
            let enemyPosition = enemyStartPosition[row] + i
            addEnemy(enemyPosition)
            enemyPositions.push(enemyPosition)
        }
    }
}



function addEnemy(position) {
    cells[position].classList.add('enemy')
}




function handlePlayerMovement(event) {
    const key = event.keyCode

    const left = 37
    const aLeft = 65
    const right = 39
    const dRight = 68
    const shoot = 32

    removePlayer ()

    if ((key === left || key === aLeft) && currentPosition % width !== 0) {
        currentPosition--
    } else if ((key === right || key === dRight) && currentPosition % width !== width -1) {
        currentPosition++
    } else if (key === shoot) {
        handleShoot()
    }

    addPlayer(currentPosition)
}



function handleShoot() { 
    const bulletPosition = currentPosition 
    const bulletIndex2 = bulletPosition % width
    addBullet(bulletPosition, bulletIndex2)
}



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




function addEnemyBullets() {
    setInterval(() => {
        // Spaces with enemies
        const availableEnemyPosition = enemyPositions.filter(position => cells[position].classList.contains('enemy'))
        if (availableEnemyPosition.length > 0) {
            //get random position with enemy present
            const randomIndex = Math.floor(Math.random() * availableEnemyPosition.length)
            const randomEnemyPosition = availableEnemyPosition[randomIndex] // Gets random position within the enemies
            handleEnemyShoot(randomEnemyPosition)
        }
    }, 2000) // Set timing for enemy bullet generation
}



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


            if (Math.random() < 0.005) {
                handleEnemyShoot(position) // Fire bullets for each enemy
            }
        })
         const enemyHitBottom = enemyPositions.some(position => position >= cellCount - width) 
            if (enemyHitBottom) {
                console.log('enemy movement');
                handleLose()
            }
    }

     enemyMovementInterval = setInterval(moveEnemies, 740) // enemy movement speed

}




function handleLose() {
    console.log('called');
        clearInterval(enemyMovementInterval)
   


        const caughtMessage = document.querySelector('.caught')
        caughtMessage.innerText = `You Got Caught. Score: ${score}. Try Again!`
   

        removePlayer()
        removeEnemies()
        removeBullets()

        score = 0  

    playCaughtSound ()
}





function removeEnemies() {
    enemyPositions.forEach(position => {
        cells[position].classList.remove('enemy')
    })
    enemyPositions = []
}




function removeBullets() {
    const bullets = document.querySelectorAll('.player-bullet, .enemy-bullet')
    bullets.forEach(bullet =>bullet.remove())
}






function PlayerShootSound () {
    const battleSound = new Audio ('./Audio/Thunderbolt.mp3')
    battleSound.play()
}

function EnemyShootSound () {
    const battleSound = new Audio ('./Audio/pokeball-sound.mp3')
    battleSound.play()
}

function playCaughtSound () {
    const battleSound = new Audio ('./Audio/pokemon-caught.mp3')
    battleSound.play()
}


//! EVENTS 
document.addEventListener('keydown', handlePlayerMovement)


//! PAGE LOAD 
createGrid()
addEnemyBullets()

} // int function close



document.getElementsByClassName('startButton')[0].addEventListener('click', () => {
    let caughtMessage = document.querySelector('.caught')
    caughtMessage.innerText = `Don't Get Caught!`

    playSound()
    init()
})

function playSound () {
    const battleSound = new Audio ('./Audio/pokemon-battle.mp3')
    battleSound.play()
}