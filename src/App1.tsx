// Мы ожидаем, что Вы исправите синтаксические ошибки, сделаете перехват возможных исключений и улучшите читаемость кода.
// А так же, напишите кастомный хук useThrottle и используете его там где это нужно.
// Желательно использование React.memo и React.useCallback там где это имеет смысл.
// Будет большим плюсом, если Вы сможете закэшировать получение случайного пользователя.
// Укажите правильные типы.
// По возможности пришлите Ваш вариант в https://codesandbox.io

import React, { useState,  useEffect } from "react";

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
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{user.name}</td>
          <td>{user.phone}</td>
          <td >{user.id}</td>
        </tr>
      </tbody>
    </table>
  );
}



function App(): JSX.Element {
  const [id, setId] = useState<number>(1)
  // const [item, setItem] = useState<User>(Object)
  const getId = () => {  
    const newId = Math.floor(Math.random() * (10 - 1)) + 1
    setId(prev => prev = newId)
    
  }
  // const getUser = (id) => {
  //   return fetch(`${URL}/${id}`) 
  //   .then(res => res.json())
  //   .then(data => data)  
  // }
  
  // const useRequest = ( request) => {
  //   const [dataState, setDataState] = useState();    
  //   useEffect(() => {
  //   let flag: boolean = false
  //   request()
  //   .then((data) => !flag && setDataState(data))       
    
  //       }, [request])
  
  //   return dataState
  // }
  const useGetData = (id) => {
    const [data, setData] = useState<User>(Object)

    useEffect(() => {
    // let flag: boolean = false
        fetch(`${URL}/${id}`) 
        .then(res => res.json())     
        .then(data =>  setData(data))
      // return () => flag = true  
    }, [id])
    return data
    }

  
  const item = useGetData(id)
  // const [count, setCount] = useState(0)
 
   console.log( )

  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {  
    getId()
    event.stopPropagation();
    // clickCount(event)   
    
  };
  // const clickCount = (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) => {
  //   event.stopPropagation();
  //   setCount(prev => prev + 1)
  // }

 

  return (
    <div>
      <header>Get a random user </header>
      <Button onClick={handleButtonClick} />
      <UserInfo user={item} />
    </div>
  );
}

export default App;


