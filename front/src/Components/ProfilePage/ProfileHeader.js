import React from "react";
import "../../SCSS/ProfilePage/ProfileHeader.scss";
import { Icon } from '@iconify/react';

export default function ProfileHeader(){
	return (
	<div className="profilePage-wrap">
		<div className="column-left">
			<div className="profileHeader">
				<div className="profileImage">
					<img alt="profileImage1" />
					<div className="profileImage__icons">
					  <Icon className="profile__icon1" icon="ant-design:user-add-outlined" />
					  <Icon className="profile__icon2" icon="ant-design:user-add-outlined" />
					</div>
					<div className="profile__name">jiylee
						<span className="profile__level">lv.4</span>
					</div>
					<div className="profile__bubble">
					리액트를 이용한 웹 프론트엔드 개발을 해보고 싶습니다!
					</div>
					<div className="profile__last-access">마지막 접속: 3일 전</div>
				</div>
			</div>
			<div className="profileBody">
				profilebody
			</div>
		</div>
		<div className="column-right">
			<div className="column-right__following">
				<span>jiylee님이 팔로우한 카뎃</span>
				<div></div>
			</div>
			<div className="column-right__follower">
				<span>jiylee님을 팔로우한 카뎃</span>
				<div></div>
			</div>
			<div className="column-right__other-cadets">
				<span>다른 카뎃들</span>
				<div></div>
			</div>
		</div>
	</div>
	);
}
