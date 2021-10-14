import React, { useEffect, useRef, useState } from "react";
import "../../SCSS/ProfilePage/Follow.scss";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { positions } from "../../userData";
import UnfollowAlert from "./UnfollowAlert";

export default function Follow(props) {
  const loginState = useSelector((state) => state.loginReducer);
  const [followerList, setFollowerList] = useState([]); // 보고있는 프로필의 유저id의 팔로워/팔로잉 리스트
  const [followButton, setFollowButton] = useState();
  const [unfollowAlert, setUnfollowAlert] = useState(0); // 1일때 unfollowAlert창 보임
  const [followUser, setFollowUser] = useState(); // (UnfollowAlert로 보내줄) 언팔로우 버튼이 클릭된 유저

  const handleClickOutside = (event) => {
    // if (
    //   event.target.className !== "follow__wrapper" &&
    //   event.target.offsetParent &&
    //   event.target.offsetParent.className !== "follow__wrapper"
    // ) {
    //   props.setFollowFlag(0);
    // }
  };

  document.addEventListener("mousedown", handleClickOutside);
  const getFollow = (subj) => {
    axios
      .get(
        `http://localhost:5000/user/${subj}/${
          props.userId || loginState.id
        }?page=1`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        setFollowerList(res.data);
      });
  };

  useEffect(() => {
    if (props.subject === "팔로워") getFollow("follower");
    else if (props.subject === "팔로우") getFollow("following");
  }, []);

  useEffect(() => {
    if (props.refreshFlag === 1) {
      getFollow("follower");
      getFollow("following");
      props.setRefreshFlag(0);
    }
  }, [props.refreshFlag]);

  return (
    <div className="follow__wrapper">
      <div className="follow__header">
        <div className="box-space"></div>
        <div className="follow__subject">{props.subject}</div>
        <Icon
          icon="bx:bx-x"
          height="2rem"
          className="follow__x"
          onClick={() => {
            props.setFollowFlag(0);
          }}
        />
      </div>
      <div className="follow__list">
        {followerList.length ? (
          followerList.map((v, i) => {
            return (
              <div className="follow__follower" key={i}>
                <div
                  className="follow__profile"
                  onClick={() => {
                    window.location.href = `/profile/${v.userId}`;
                  }}>
                  <img className="follow__img" src={`${v.profileImage}`} />
                  <div className="follow__info">
                    <div className="follow__name">{v.username}</div>
                    <div className="follow__position">
                      {positions[v.position]}
                    </div>
                  </div>
                </div>
                {v.userId ===
                loginState.id ? null : props.myFollowings.includes(
                    Number(props.userId)
                  ) ? (
                  <button
                    className="follow__button"
                    onClick={async () => {
                      await axios.get(
                        `http://localhost:5000/user/follow/${v.userId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              "accessToken"
                            )}`,
                          },
                        }
                      );
                      // props.setGetDataFlag(1);
                      // setFollowButton("follow");
                      // setUnfollowAlert(0);}
                    }}>
                    팔로우
                  </button>
                ) : (
                  <>
                    <button
                      className="unfollow__button"
                      onClick={() => {
                        setUnfollowAlert(1);
                        setFollowUser(v);
                      }}>
                      <Icon
                        icon="bx:bxs-user-check"
                        className="unfollow__icon"
                        style={{ fontSize: "1.3rem" }}
                      />
                    </button>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-follow">
            <span>아직 {props.subject}가 없어요 😯</span>
          </div>
        )}
      </div>
      {unfollowAlert === 1 && (
        <UnfollowAlert
          setUnfollowAlert={setUnfollowAlert}
          setFollowButton={setFollowButton}
          setGetDataFlag={props.setGetDataFlag}
          user={followUser}
          setRefreshFlag={props.setRefreshFlag}
        />
      )}
    </div>
  );
}
