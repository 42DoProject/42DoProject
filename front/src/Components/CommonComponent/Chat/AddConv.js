import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import UserNameCard from "./UserNameCard";

export default function Conv({
  chatOutFlag,
  setChatOutFlag,
  setConvFlag,
  clickFlag,
}) {
  const [user, setUser] = useState();
  const [userIdList, setUserIdList] = useState([]);
  const [userNameList, setUserNameList] = useState([]);
  const loginState = useSelector((state) => state.loginReducer);

  const addUserList = (userId, userName) => {
    let newIdList = [...new Set([...userIdList, userId])];
    setUserIdList(newIdList);
    let newNameList = [...new Set([...userNameList, userName])];
    setUserNameList(newNameList);
  };

  const searchUser = async (name) => {
    try {
      const {
        data: { user },
      } = await axios.get(
        `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/search/${name}`
      );
      const userList = user.filter((e) => e.id != loginState.id);
      setUser(userList);
    } catch (err) {
      console.log(err);
      setUser();
    }
  };

  const inviteUser = async (userId) => {
    await axios({
      method: "POST",
      url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/chat`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
      data: {
        users: [...userId],
      },
    });
    chatOutFlag ? setChatOutFlag(0) : setChatOutFlag(1);
    setConvFlag(0);
  };
  useEffect(() => {
    const $input = document.querySelector(".chatLog__addConv input");
    $input.focus();
  }, []);
  return (
    <>
      <div className="chatLog__addConv">
        <span className="addConv__placeholder">대화 상대 추가 : </span>
        <div className="userNameList">
          {userNameList.length != 0 &&
            userNameList?.map((e, idx) => (
              <UserNameCard
                key={idx}
                idx={idx}
                name={e}
                userIdList={userIdList}
                userNameList={userNameList}
                setUserIdList={setUserIdList}
                setUserNameList={setUserNameList}
              />
            ))}
        </div>
        <input
          type="text"
          className="addConv__input"
          list="chat-userList"
          onChange={(e) => searchUser(e.target.value)}
        />
      </div>
      {clickFlag == 0 ? (
        <div className="chatLog__addUser">
          {user?.map((e) => {
            return (
              <div
                className="addUser__card"
                key={e.id}
                onClick={(event) => {
                  const chatLogInput =
                    document.querySelector(".addConv__input");
                  if (userNameList.length <= 1) addUserList(e.id, e.username);
                  chatLogInput.value = "";
                  chatLogInput.focus();
                }}
              >
                <img src={e.profileImage} />
                <div>{e.username}</div>
              </div>
            );
          })}
          {userNameList.length !== 0 && (
            <div className="chat-create" onClick={() => inviteUser(userIdList)}>
              방 만들기
            </div>
          )}
        </div>
      ) : (
        <div className="chatLog__addUser-big">
          {user?.map((e) => {
            return (
              <div
                className="addUser__card"
                key={e.id}
                onClick={(event) => {
                  const chatLogInput =
                    document.querySelector(".addConv__input");
                  addUserList(e.id, e.username);
                  chatLogInput.value = "";
                  chatLogInput.focus();
                }}
              >
                <img src={e.profileImage} />
                <div>{e.username}</div>
              </div>
            );
          })}
          {userNameList.length !== 0 && (
            <div className="chat-create" onClick={() => inviteUser(userIdList)}>
              방 만들기
            </div>
          )}
        </div>
      )}
    </>
  );
}
