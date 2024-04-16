
// Мы ожидаем, что Вы исправите синтаксические ошибки, сделаете перехват возможных исключений и улучшите читаемость кода.
// А так же, напишите кастомный хук useThrottle и используете его там где это нужно.
// Желательно использование React.memo и React.useCallback там где это имеет смысл.
// Будет большим плюсом, если Вы сможете закэшировать получение случайного пользователя.
// Укажите правильные типы.
// По возможности пришлите Ваш вариант в https://codesandbox.io


import React, { useState, useCallback,useEffect, useRef, useMemo, memo } from "react";

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
  address: any
};

interface IButtonProps {
  onClick: any;
}

function Button({ onClick }: IButtonProps): JSX.Element {
  return (
    <button id="button" type="button" onClick={onClick}>
      get random user
    </button>
  );}

interface IUserInfoProps {
  user: User;}

// мемоизируем компонент для совместной работы c useCallback
const UserInfo = memo (({ user }: IUserInfoProps): JSX.Element => {
  return (
    <>
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Phone number</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{user.name}</td>
          <td>{user.phone}</td>
        </tr>
      </tbody>
    </table>
    </>
  );
  
})

// Создаем хук useThrottle, использовать его будем когда пользователь
// в течение некоторого времени бесконечно нажимает на кнопку для отправки запроса на сервер
// для этого value будет принимать функцию callback, а delay количество секунд, через которые 
// будет выполняться useThrottle
const useThrottle = (value: any, delay: number) => {
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
  // мемоизируем данные для состояния загрузки и ошибок
  const InitialState = useMemo(() =>({
    loading: true, 
    error: null
  }), [])
  const [item, setItem] = useState<User>(Object);
  const [dataState, setDataState] = useState(InitialState); 
  const [id, setId] = useState<number | null>(null)
  const btn = document.getElementById('button')

  // создаем функцию для вычисления случайного id пользователя
  // вызывать будем при клике на кнопку, как только получим уникальный номер,
  // то функция receiveRandomUser() сделает запрос на сервер самостоятельно
  const getId  = (): void => {    
    const newId: number = Math.floor(Math.random() * (10 - 1)) + 1;  
    const cache: number | null = id; 
    if (newId !== cache){   
      setId(prev => prev = newId)   
     } else {
      setId(prev => prev = cache) 
      //getId() // вызов рекурсии повлияет на то, что при каждом запросе всегда будет уникальный id
     }
  }
  // для receiveRandomUser() исользуем хук useCallback, для того чтобы мемоизировать 
  // результаты выполнения запросов на сервер
  const receiveRandomUser = useCallback((): void => {      
    setDataState(InitialState);   
    fetch(`${URL}/${id}`) 
      .then(res => res.json())     
      .then(data => {
        setItem(data); 
        setDataState({
          loading: false, 
          error: null})})          
        .catch(error => setDataState({ 
          loading: false,
          error}))   
  }, [InitialState, id])

// создадим переменную throttle, в котору передадимм хук useThrottle
// в качестве функции-колбэк receiveRandomUser(), количество секунд равное 5,
// то есть через каждые 5 секунд будет вызываться функция для отпроавки запросов на сервер,
// в случае, когда пользователь долго будет нажимать бесконечно кнопку пользователя 
const throttle = useThrottle(receiveRandomUser, 5000); 
 
useEffect(() => {
  btn?.addEventListener('click', () => throttle) 
  return () => {
    btn?.removeEventListener('click', () => throttle) 
  }
 }, [btn, id, throttle]);


  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
   getId(); 
  };

  return (
    <div>
      <header>Get a random user</header>
      <Button onClick={handleButtonClick} />
      <div>{dataState.loading ? 'Loading...' : <UserInfo user={item} />}</div>
      <div>{dataState.error ? 'Something is wrong': ''}</div>
      
    </div>
  );
}

export default App;
