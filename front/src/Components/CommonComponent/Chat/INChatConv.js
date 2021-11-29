import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import UserNameCard from "./UserNameCard";
import { Icon } from "@iconify/react";

export default function Conv({
  setInviteFlag,
  chatOutFlag,
  setChatOutFlag,
  clickFlag,
  chatRoom,
  setInFlag,
}) {
  const [user, setUser] = useState();
  const [userList, setUserList] = useState([]);
  const loginState = useSelector((state) => state.loginReducer);

  const addUserList = (obj) => {
    if (userList.filter((e) => e.id === obj.id).length === 0) {
      let newList = [...userList, obj];
      setUserList(newList);
    }
  };

  const searchUser = async (name) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/search/user/${name}`,
        {
          headers: {
            Authorization: `Bearer ${loginState?.accessToken}`,
          },
        }
      );
      const userList = data.filter((e) => e.id != loginState.id);
      setUser(userList);
    } catch (err) {
      console.log(err);
      setUser();
    }
  };
  const inviteUser = async (userId) => {
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/chat/${chatRoom.uuid}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
      data: {
        users: userId,
      },
    });
    chatOutFlag ? setChatOutFlag(0) : setChatOutFlag(1);
    setInFlag(-1);
  };

  useEffect(() => {
    const $input = document.querySelector(".chatLog__addConv input");
    $input.focus();
    const clickListener = function (e) {
      if (e?.target?.className == "chatCard-me") {
        setInviteFlag(0);
      }
    };
    document.body.addEventListener("click", clickListener);
  }, []);

  return (
    <>
      {userList.length !== 0 && (
        <div className="select__userList">
          {userList.map((e, idx) => (
            <UserNameCard
              key={idx}
              idx={idx}
              userInfo={e}
              userList={userList}
              setUserList={setUserList}
            />
          ))}
        </div>
      )}
      <div className="chatLog__addConv">
        <input
          type="text"
          className="addConv__input"
          list="chat-userList"
          onChange={(e) => searchUser(e.target.value)}
          placeholder="대화 상대를 검색해 추가해 보세요"
        />
        <Icon
          className="create-icon"
          style={{ fontSize: "1.8rem", cursor: "pointer" }}
          icon="ant-design:check-circle-filled"
          onClick={() => {
            const userIdList = userList.map((e) => e.id);
            inviteUser(userIdList);
          }}
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
                  addUserList({
                    name: e.username,
                    profile: e.profileImage,
                    id: e.id,
                  });
                  chatLogInput.value = "";
                  chatLogInput.focus();
                }}
              >
                <img src={e.profileImage} />
                <div>{e.username}</div>
              </div>
            );
          })}
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
                  addUserList({
                    name: e.username,
                    profile: e.profileImage,
                    id: e.id,
                  });
                  chatLogInput.value = "";
                  chatLogInput.focus();
                }}
              >
                <img src={e.profileImage} />
                <div>{e.username}</div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
