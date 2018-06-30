arena="standard_1s"
if [ "$1" = "standard" ]
then
    arena=$1
elif [ "$1" = "large"  ]
then
    arena=$1
elif [ "$1" = "large_1s" ]
then 
    arena=$1
fi

echo "entering the arena: $arena"

while true
    do 
        node haggle.js --id cfzhou@uwaterloo.ca:990302 negotiator.js wss://hola.org/challenges/haggling/arena/$arena
    done

