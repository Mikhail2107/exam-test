
// Мы ожидаем, что Вы исправите синтаксические ошибки, сделаете перехват возможных исключений и улучшите читаемость кода.
// А так же, напишите кастомный хук useThrottle и используете его там где это нужно.
// Желательно использование React.memo и React.useCallback там где это имеет смысл.
// Будет большим плюсом, если Вы сможете закэшировать получение случайного пользователя.
// Укажите правильные типы.
// По возможности пришлите Ваш вариант в https://codesandbox.io


import React, { useState, useCallback,useEffect, useRef, useMemo } from "react";

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
        </tr>
      </tbody>
    </table>
  );
}

const useThrottle = (value: any, delay: number) => {
  const [throttleValue, setThrottleValue] = useState(value);

  const lastExecuted = useRef(Date.now()); //момент последнего использования
  
  useEffect(() => {
    const handler = setTimeout(() => {// устанавливаем та
      const now = Date.now(); // получаем текущее момент времени
      const timeElapsed = now -lastExecuted.current; // получаем сколько времени уже прошло

      if (timeElapsed >= delay){ // если время которое прошло больше или равно заданному, 
        setThrottleValue(value);//то установим новое состояние и укажем новое время момент последнего использования
        lastExecuted.current = now;
      }
    }, delay - (Date.now() - lastExecuted.current)); //вычислям время для таймера

    return () => {
      clearTimeout(handler)//удаляем таймер
    }
  }, [delay, value])
}

function App(): JSX.Element {
  const InitialState = useMemo(() =>({ //данные по загрузке
    loading: true, // пока нет данных показываем Loading...
    error: null
  }), [])
  const [item, setItem] = useState<User>(Object);
  const [dataState, setDataState] = useState(InitialState); // создает стэйт для данных по загрузке
  const [id, setId] = useState<number>(0)
  const btn = document.getElementById('button')// получаем доступ к кнопке

  const getId  = (): void => {    
    const newId: number = Math.floor(Math.random() * (10 - 1)) + 1 //создаем новый id     
    const cache: number = id; //кладем id в кэш
    if (newId !== cache){   // если новый id  отсутсвует в кэше
      setId(prev => prev = newId) //  передаем новый id в id   
     } else {
      setId(prev => prev = cache) 
      //getId() // вызов рекурсии повляет на то, что при каждом запросе всегда будет не повторяющийся id
     }
  }
  
  const receiveRandomUser = useCallback((): void => {      
    setDataState(InitialState)   // обновляем стейт
      fetch(`${URL}/${id}`) // делаем запрос к сереверу
        .then(res => res.json())     
        .then(data => {
          setItem(data); //сохраняем полученные данные
          setDataState({
          loading: false, // когда данные получены меняем состояние загрузки
          error: null})}) //          
        .catch(error => setDataState({ // если вылововели ошибку меняем состояние error
          loading: false,
          error}))   
  }, [InitialState, id])

const throttle = useThrottle(receiveRandomUser, 5000); //используем  хук useThrottle передаем функцию для получения данных с промежуком 5 секунд
 
useEffect(() => {
  btn?.addEventListener('click', () => throttle) // вешаем слушатель на кнопку
  return () => {
    btn?.removeEventListener('click', () => throttle) // удаляем слушатель
  }
 }, [btn, id, throttle]);


  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
   getId(); // при нажатии на кнопку меняем состояние случайного пользователя, 
            // при при получении нового id функция receiveRandomUser получит данны случайного пользователя 
  };

  return (
    <div>
      <header>Get a random user</header>
      <Button onClick={handleButtonClick} />
      <p>{dataState.loading ? 'Loading...' : <UserInfo user={item} />}</p>
      <p>{dataState.error ? 'Something is wrong': ''}</p>
      
    </div>
  );
}

export default App;
