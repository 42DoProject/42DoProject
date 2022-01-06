import React, { useEffect, useState } from "react";
import { positions } from "../../userData";
import { useSelector } from "react-redux";
// import defaultImg from "../../default_intra.png";
import blankImg from "../../blankImg.png";
import axios from "axios";
import { Icon } from "@iconify/react";

export default function FollowCard({
  v,
  myFollowings,
  setGetDataFlag,
  setUnfollowAlert,
  setFollowUser,
}) {
  const loginState = useSelector((state) => state.loginReducer);
  const [profileUrl, setProfileUrl] = useState();

  useEffect(() => {
    const resizedImage = async (key, size) => {
      // 정상적으로 가져와지면 resized url반환, 아니면 원본이미지 url반환
      const url = key.split("/");
      url[url.length - 3] = size;
      const resized = url.join("/");
      try {
        await axios({
          method: "head",
          url: `${resized}?timestamp=${Date.now()}`,
        });
        setProfileUrl(resized);
      } catch (err) {
        console.log(err);
        setProfileUrl(key);
      }
    };
    if (v?.profileImage) resizedImage(v.profileImage, "100");
  }, [v]);

  const followUser = async () => {
    try {
      await axios.get(
        `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/user/follow/${v.userId}`,
        {
          headers: {
            Authorization: `Bearer ${loginState.accessToken}`,
          },
        }
      );
      console.log("Successfully followed userId:", v.userId);
      setGetDataFlag(1);
      // setFollowButton("unfollow");
      setUnfollowAlert(0);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="follow__follower" key={v.userId}>
        <div
          className="follow__profile"
          onClick={() => {
            window.location.href = `/profile/${v.userId}`;
          }}>
          <img className="follow__img" src={`${profileUrl || blankImg}`} />
          <div className="follow__info">
            <div className="follow__name">{v.username}</div>
            <div className="follow__position">{positions[v.position]}</div>
          </div>
        </div>
        {!loginState ||
        (loginState &&
          v.userId === loginState.id) ? null : !myFollowings.includes(
            v.userId
          ) ? (
          <button className="follow__button" onClick={() => followUser()}>
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
    </div>
  );
}
