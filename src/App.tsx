
// Мы ожидаем, что Вы исправите синтаксические ошибки, сделаете перехват возможных исключений и улучшите читаемость кода.
// А так же, напишите кастомный хук useThrottle и используете его там где это нужно.
// Желательно использование React.memo и React.useCallback там где это имеет смысл.
// Будет большим плюсом, если Вы сможете закэшировать получение случайного пользователя.
// Укажите правильные типы.
// По возможности пришлите Ваш вариант в https://codesandbox.io


import React, { useState, useCallback,useEffect, useRef } from "react";

const URL = "https://jsonplaceholder.typicode.com/users";

type Company = {
  bs: string;
  catchPhrase: string;
  name: string;
};

type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  username: string;
  website: string;
  company: Company;
  address: string[]
};

interface IButtonProps {
  onClick: any;
}

function Button({ onClick }: IButtonProps): JSX.Element {
  return (
    <button type="button" onClick={onClick}>
      get random user
    </button>
  );
}

interface IUserInfoProps {
  user: User;
}

function UserInfo({ user }: IUserInfoProps): JSX.Element {
  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Phone number</th>
          <th>Phone id</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{user.name}</td>
          <td>{user.phone}</td>
          <td>{user.id}</td>
        </tr>
      </tbody>
    </table>
  );
}
const useThrottle = (value: void, delay: number) => {
  const [throttleValue, setThrottleValue] = useState(value);

  const lastExecuted = useRef(Date.now());
  
  useEffect(() => {
    const handler = setTimeout(() => {
      const now = Date.now();
      const timeElapsed = now -lastExecuted.current;

      if (timeElapsed >= delay){
        setThrottleValue(value);
        lastExecuted.current = now;
      }
    }, delay - (Date.now() - lastExecuted.current));

    return () => {
      clearTimeout(handler)
    }
  }, [delay, value])
}

function App(): JSX.Element {
  const [id, setId] = useState<number>(1);
  const [item, setItem] = useState<User>(Object);
  const [count, setCount] = useState(0)

  const getId  = (): void => {
    const newId = Math.floor(Math.random() * (10 - 1)) + 1
    setId(prev => prev = newId)    
  }
  
  const receiveRandomUser = useCallback((): void => {     
      fetch(`${URL}/${id}`) 
        .then(res => res.json())     
        .then(data => setItem(data))   
  }, [id])

  

  const throttle = useThrottle(receiveRandomUser(), 5000)
 
useEffect(() => {
  window.addEventListener('click', () => throttle)
  return () => {
    window.removeEventListener('click', () => throttle)
  }
 }, [id, throttle]);

   const clickCount = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setCount(prev => prev + 1)
  }
  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
   getId();
   clickCount(event);
  };
  console.log(id)

  return (
    <div>
      <header>Get a random user Count = {count}</header>
      <Button onClick={handleButtonClick} />
      <UserInfo user={item} />
    </div>
  );
}

export default App;
