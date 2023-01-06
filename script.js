const canvas = document.querySelector('#game');
const context = canvas.getContext('2d');

const canvas_item = document.querySelector('#next_item');
const ctx = canvas_item.getContext('2d');
var fieldNext = [];

const grid =  32;
var tetrominoSequence = [];
var playfield = [];

for(let row = -2; row < 20; row++){
    playfield[row]=[];

    for(let col = 0; col < 10; col++){
        playfield[row][col]=0;
    }
}

const tetrominos = {
    'I':[
         [0,0,0,0],
         [1,1,1,1],
         [0,0,0,0],
         [0,0,0,0]
    ],
    'L':[
        [1,0,0],
        [1,1,1],         
        [0,0,0],                 
    ],
    'J':[
        [0,0,1],
        [1,1,1],         
        [0,0,0],                 
    ],
    'O':[
        [1,1],
        [1,1],                        
    ],
    'S':[
        [0,1,1],
        [1,1,0],         
        [0,0,0],                 
    ],
    'Z':[
        [1,1,0],
        [0,1,1],         
        [0,0,0],                 
    ],
    'T':[
        [0,1,0],
        [1,1,1],         
        [0,0,0],                 
    ]
};

const colors = {
    'I': 'red',
    'L': 'blue',
    'J': 'green',
    'O': 'orange',
    'S': 'purple',
    'Z': 'yellow',
    'T': 'cyan'
};

let count = 0;
let tetromino = getNextTetromino();

let rAF = null; //кадры анимации, если не 0 - останавливаем
let gameOver = false;


function getRandomInt(min,max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return (Math.floor(Math.random() * (max - min + 1)) + min);
}

function generateSequence(){
    console.log(1);

    const sequence = ['I','L','J','O','S','Z','T','I','L','J','O','S','Z','T','I','L','J','O','S','Z','T'];



    for(let i=0; i < sequence.length; i++){
        let random = getRandomInt(0, sequence.length - 1);
        tetrominoSequence.push(sequence[random]);
        // console.log(sequence[random]);

    }
    // console.log(tetrominoSequence);
    
}
//   generateSequence();









function getNextNext(){

    for (let row = 0; row < fieldNext.length; row++) {
        for (let col = 0; col < fieldNext[row].length; col++) {
          if (fieldNext[row][col]) {
            
            ctx.fillStyle = 'black';
            ctx.fillRect(col * grid, row * grid, grid-1, grid-1);
   
          }
        }
      }

    
    const next = tetrominoSequence[tetrominoSequence.length-2];
    // console.log(next);
    fieldNext = tetrominos[next];
    console.table(fieldNext);

    
    for (let row = 0; row < fieldNext.length; row++) {
        for (let col = 0; col < fieldNext[row].length; col++) {
          if (fieldNext[row][col]) {
            ctx.fillStyle = colors[next];
            ctx.fillRect(col * grid, row * grid, grid-1, grid-1);
   
          }
        }
      }

}


function getNextTetromino() {
    if (tetrominoSequence.length <= 3) {
      generateSequence();
    }
    getNextNext();
    const name = tetrominoSequence.pop();

    // сразу создаём матрицу, с которой мы отрисуем фигуру
    const matrix = tetrominos[name];

    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
  
    const row = name === 'I' ? -1 : -2;
  
        return {
      name: name,       
      matrix: matrix,  
      row: row,       
      col: col         
    };
  }
// console.log(getNextTetromino());

/// ДВИЖЕНИЕ И ВРАЩЕНИЕ , ОСТАНОВКА

function rotate(matrix){
     const N =  matrix.length - 1;
      const result = matrix.map((row,i)=> row.map((val,j) => matrix[N-j][i]));
      return result;
}

function isValidMove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] && (
          cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          playfield[cellRow + row][cellCol + col])
        ) {
        return false;
      }
    }
  }
  return true;
}   


let scoreItteration = false;
let score=1;

function placeTetromino(){
    for(let row = 0; row < tetromino.matrix.length ; row++){
        for(let col = 0; col < tetromino.matrix[row].length ; col++){
            if(tetromino.matrix[row][col]){

                if(tetromino.row + row < 0){
                    return showGameOver();
                }
                playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
            }
        }
    }




    for(let row = playfield.length - 1 ; row >= 0 ;){
        if(playfield[row].every((cell) => !!cell)){
            for(let r = row ; r >= 0 ;r--){
                for(let c = 0; c < playfield[r].length ; c++){
                    playfield[r][c] = playfield[r-1][c];
                    scoreItteration = true;

                }
            }
        }
        else{
            row--;
            scoreItteration = false;
        }
        if(scoreItteration){

            ///при собирании строки следующие Ивенты:
            document.body.querySelector('.score').innerHTML = `Score: ${score++}`;
            document.querySelector('.audio1').play();
             }
        scoreItteration = false;

    }




tetromino = getNextTetromino();
}

function showGameOver() {
  cancelAnimationFrame(rAF);
  gameOver = true;
  context.fillStyle = 'black';
  context.globalAlpha = 0.75;
  context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

  context.globalAlpha = 1;
  context.fillStyle = 'white';
  context.font = '36px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
  this.addEventListener('click',()=> {
    location.reload(); return false;  });
  this.addEventListener('mousemove',()=> {
    location.reload(); return false;  });

    document.querySelector('.audio2').play();


}




document.addEventListener('keydown',function(e){
    if(gameOver)return;

    if(e.which === 37 || e.which === 39){
        const col = (e.which ===37)?tetromino.col -1 : tetromino.col + 1;
        
         if(isValidMove(tetromino.matrix, tetromino.row , col)){
             tetromino.col = col;
          }
    }

    if(e.which === 38){
        const matrix = rotate(tetromino.matrix);
        
         if(isValidMove(tetromino.matrix, tetromino.row , tetromino.col)){
             tetromino.matrix = matrix;
          }
    }
    
    if(e.which === 40){
        const row = tetromino.row + 1;
        
         if(!isValidMove(tetromino.matrix, row , tetromino.col)){
            const row = tetromino.row + 1;
        placeTetromino();
        return;         
     }
     tetromino.row = row ;

    }

});

let speed;
///отрисовка ФИНАЛ
function loop(){
    rAF = requestAnimationFrame(loop);
    context.clearRect(0,0,canvas.width,canvas.height);


    for(let row = 0 ; row < 20; row++){
        for(let col = 0 ; col<10; col++){
            if(playfield[row][col]){
                const name= playfield[row][col];
                context.fillStyle = colors[name];

                context.fillRect(col*grid, row*grid, grid-1, grid -1);
            }
        }
    }
    if(tetromino){
        speed = 35;
        if(score >10    ) {
            speed = 8;

        } 
        if(score > 5 && score < 10) {
            speed = 20;
        } 
       



        if(++count >speed){
            tetromino.row++;
            count = 0;

        if(!isValidMove(tetromino.matrix, tetromino.row , tetromino.col)){
           tetromino.row--;
           placeTetromino(); 
         }
        }



        context.fillStyle = colors[tetromino.name];

        for(let row = 0; row < tetromino.matrix.length ; row++){
            for(let col = 0 ; col < tetromino.matrix[row].length ; col++){
                if(tetromino.matrix[row][col]){
                    context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
                }
            }
        }

    }
}
rAF = requestAnimationFrame(loop);




