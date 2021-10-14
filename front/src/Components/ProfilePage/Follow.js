import React, { useEffect, useState } from "react";
import "../../SCSS/ProfilePage/Follow.scss";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Follow(props) {
  const loginState = useSelector((state) => state.loginReducer);
  const [followerList, setFollowerList] = useState([]);
  const [followButton, setFollowButton] = useState();

  const handleClickOutside = (event) => {
    if (
      event.target.className !== "follow__wrapper" &&
      event.target.offsetParent &&
      event.target.offsetParent.className !== "follow__wrapper"
    ) {
      props.setFollowFlag(0);
    }
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
            Authorization: `Bearer ${props.ACCESS_TOKEN}`,
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

  // useEffect(() => {
  //   props.myFollowings.includes(Number(props.userId))
  //     ? setFollowButton("unfollow")
  //     : setFollowButton("follow");
  // }, [props.myFollowings]);

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
                    <div className="follow__position">{v.position}</div>
                  </div>
                </div>
                <button
                  className="follow__button"
                  onClick={async () => {
                    await axios.get(
                      `http://localhost:5000/user/follow/${v.userId}`,
                      {
                        headers: {
                          Authorization: `Bearer ${props.ACCESS_TOKEN}`,
                        },
                      }
                    );
                    // props.setGetDataFlag(1);
                    // setFollowButton("follow");
                    // setUnfollowAlert(0);}
                  }}>
                  팔로우
                </button>
              </div>
            );
          })
        ) : (
          <div className="no-follow">
            <span>아직 {props.subject}가 없어요 😯</span>
          </div>
        )}
      </div>
    </div>
  );
}
