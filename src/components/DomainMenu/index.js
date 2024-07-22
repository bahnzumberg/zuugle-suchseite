import React from "react";
import { Box, Modal, Typography } from "@mui/material";
import { getDomainText } from "../../utils/globals";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function DomainMenu() {

let host = window.location.href;

let listOfDomains = [];
let domain = 'www.zuugle.at';

if(process.env.NODE_ENV === "development") {
	
		if (host.indexOf("http://localhost:3000/") >= 0) {
		domain = 'http://localhost:3000/';
		listOfDomains = [
			{
				id: 0,
				name: "Localhost",
				url: "http://localhost:3000/",
			},
			{
				id: 1,
				name: "Zuugle.at",
				url: "https://www.zuugle.at",
			},
			{
				id: 2,
				name: "Zuugle.ch",
				url: "https://www.zuugle.ch",
			},
			{
				id: 3,
				name: "Zuugle.de",
				url: "https://www.zuugle.de",
			},
			{
				id: 4,
				name: "Zuugle.it",
				url: "https://www.zuugle.it",
			},
			{
				id: 5,
				name: "Zuugle.si",
				url: "https://www.zuugle.si",
			},
		];
	}
}

if (host.indexOf("www.zuugle.at") >= 0) {
	domain = 'www.zuugle.at';
	listOfDomains = [
		{
			id: 0,
			name: "Zuugle.at",
			url: "https://www.zuugle.at",
		},
		{
			id: 1,
			name: "Zuugle.ch",
			url: "https://www.zuugle.ch",
		},
		{
			id: 2,
			name: "Zuugle.de",
			url: "https://www.zuugle.de",
		},
		{
			id: 3,
			name: "Zuugle.it",
			url: "https://www.zuugle.it",
		},
		{
			id: 4,
			name: "Zuugle.si",
			url: "https://www.zuugle.si",
		},
	];
}
else if (host.indexOf("www.zuugle.de") >= 0) {
	domain = 'www.zuugle.de';
	listOfDomains = [
		{
			id: 0,
			name: "Zuugle.de",
			url: "https://www.zuugle.de",
		},
		{
			id: 1,
			name: "Zuugle.at",
			url: "https://www.zuugle.at",
		},
		{
			id: 2,
			name: "Zuugle.ch",
			url: "https://www.zuugle.ch",
		},
		{
			id: 2,
			name: "Zuugle.it",
			url: "https://www.zuugle.it",
		},
		{
			id: 3,
			name: "Zuugle.si",
			url: "https://www.zuugle.si",
		},
	];
}
else if (host.indexOf("www.zuugle.si") >= 0) {
	domain = 'www.zuugle.si';
	listOfDomains = [
		{
			id: 0,
			name: "Zuugle.si",
			url: "https://www.zuugle.si",
		},
		{
			id: 1,
			name: "Zuugle.at",
			url: "https://www.zuugle.at",
		},
		{
			id: 2,
			name: "Zuugle.ch",
			url: "https://www.zuugle.ch",
		},
		{
			id: 3,
			name: "Zuugle.de",
			url: "https://www.zuugle.de",
		},
		{
			id: 4,
			name: "Zuugle.it",
			url: "https://www.zuugle.it",
		},
	];
}
else if (host.indexOf("www.zuugle.it") >= 0) {
	domain = 'www.zuugle.it';
	listOfDomains = [
		{
			id: 0,
			name: "Zuugle.it",
			url: "https://www.zuugle.it",
		},
		{
			id: 1,
			name: "Zuugle.at",
			url: "https://www.zuugle.at",
		},
		{
			id: 2,
			name: "Zuugle.ch",
			url: "https://www.zuugle.ch",
		},
		{
			id: 3,
			name: "Zuugle.de",
			url: "https://www.zuugle.de",
		},
		{
			id: 4,
			name: "Zuugle.si",
			url: "https://www.zuugle.si",
		},
	];
}
else if (host.indexOf("www.zuugle.ch") >= 0) {
	domain = 'www.zuugle.ch';
	listOfDomains = [
		{
			id: 0,
			name: "Zuugle.ch",
			url: "https://www.zuugle.ch",
		},
		{
			id: 1,
			name: "Zuugle.at",
			url: "https://www.zuugle.at",
		},
		{
			id: 2,
			name: "Zuugle.de",
			url: "https://www.zuugle.de",
		},
		{
			id: 3,
			name: "Zuugle.it",
			url: "https://www.zuugle.it",
		},
		{
			id: 4,
			name: "Zuugle.si",
			url: "https://www.zuugle.si",
		},
	];
}
else if (host.indexOf("www.zuugle.fr") >= 0) {
	domain = 'www.zuugle.fr';

}
if (host.indexOf("www2.zuugle.at") >= 0) {
	domain = 'www2.zuugle.at';
	listOfDomains = [
		{
			id: 0,
			name: "UAT Zuugle.at",
			url: "https://www2.zuugle.at",
		},
		{
			id: 1,
			name: "UAT Zuugle.ch",
			url: "https://www2.zuugle.ch",
		},
		{
			id: 2,
			name: "UAT Zuugle.de",
			url: "https://www2.zuugle.de",
		},
		{
			id: 3,
			name: "UAT Zuugle.it",
			url: "https://www2.zuugle.it",
		},
		{
			id: 4,
			name: "UAT Zuugle.si",
			url: "https://www2.zuugle.si",
		},
	];
}
else if (host.indexOf("www2.zuugle.de") >= 0) {
	domain = 'www2.zuugle.de';
	listOfDomains = [
		{
			id: 0,
			name: "UAT Zuugle.de",
			url: "https://www2.zuugle.de",
		},
		{
			id: 1,
			name: "UAT Zuugle.at",
			url: "https://www2.zuugle.at",
		},
		{
			id: 2,
			name: "UAT Zuugle.ch",
			url: "https://www2.zuugle.ch",
		},
		{
			id: 3,
			name: "UAT Zuugle.it",
			url: "https://www2.zuugle.it",
		},
		{
			id: 4,
			name: "UAT Zuugle.si",
			url: "https://www2.zuugle.si",
		},
	];
}
else if (host.indexOf("www2.zuugle.si") >= 0) {
	domain = 'www2.zuugle.si';
	listOfDomains = [
		{
			id: 0,
			name: "UAT Zuugle.si",
			url: "https://www2.zuugle.si",
		},
		{
			id: 1,
			name: "UAT Zuugle.at",
			url: "https://www2.zuugle.at",
		},
		{
			id: 2,
			name: "UAT Zuugle.ch",
			url: "https://www2.zuugle.ch",
		},
		{
			id: 3,
			name: "UAT Zuugle.de",
			url: "https://www2.zuugle.de",
		},
		{
			id: 4,
			name: "UAT Zuugle.it",
			url: "https://www2.zuugle.it",
		},
	];
}
else if (host.indexOf("www2.zuugle.it") >= 0) {
	domain = 'www2.zuugle.it';
	listOfDomains = [
		{
			id: 0,
			name: "UAT Zuugle.it",
			url: "https://www2.zuugle.it",
		},
		{
			id: 1,
			name: "UAT Zuugle.at",
			url: "https://www2.zuugle.at",
		},
		{
			id: 2,
			name: "UAT Zuugle.ch",
			url: "https://www2.zuugle.ch",
		},
		{
			id: 3,
			name: "UAT Zuugle.de",
			url: "https://www2.zuugle.de",
		},
		{
			id: 4,
			name: "UAT Zuugle.si",
			url: "https://www2.zuugle.si",
		},
	];
}
else if (host.indexOf("www2.zuugle.ch") >= 0) {
	domain = 'www2.zuugle.ch';
	listOfDomains = [
		{
			id: 0,
			name: "UAT Zuugle.ch",
			url: "https://www2.zuugle.ch",
		},
		{
			id: 1,
			name: "UAT Zuugle.at",
			url: "https://www2.zuugle.at",
		},
		{
			id: 2,
			name: "UAT Zuugle.de",
			url: "https://www2.zuugle.de",
		},
		{
			id: 3,
			name: "UAT Zuugle.it",
			url: "https://www2.zuugle.it",
		},
		{
			id: 4,
			name: "UAT Zuugle.si",
			url: "https://www2.zuugle.si",
		},
	];
}
else if (host.indexOf("www2.zuugle.fr") >= 0) {
	domain = 'www2.zuugle.fr';

}


const secondMenu = [
	{ id: 0, name: "Über Zuugle", url: "https://verein.bahn-zum-berg.at/" },
	{ id: 1, name: "Impressum", url: "https://" + domain + "/imprint" },
	{ id: 2, name: "Datenschutz", url: "https://" + domain + "/privacy" },
];
	const [showDomainMenu, setShowDomainMenu] = React.useState(false);

	return (
		<Box component={"div"} className="colLeft">
			<div
				className="countrySwitch rowing"
				onClick={() => setShowDomainMenu(true)}
			>
				<img
					src={`/app_static/img/logo-white.png`}
					height={"19px"}
					width={"34px"}
					alt="logo white"
				/>
				<Typography
					style={{
						fontSize: "15.4px",
						color: "#FFF",
						lineHeight: "21px",
						marginLeft: "5px",
					}}
				>
					{getDomainText()}
				</Typography>
				<KeyboardArrowDownIcon sx={{ width: "25px", color: "#ffff" }} />
			</div>
			{showDomainMenu && (
				<Modal
					onClose={() => setShowDomainMenu(false)}
					open={showDomainMenu}
					style={{ outline: "none", border: "none" }}
				>
					<div className="domainMenu colCenteral">
						{listOfDomains.map((item,i) =>
							i === 0 ? 
							(
								<div
									className="rowing"
									key={item.id}
									style={{ paddingTop: 12, paddingBottom: 12 }}
								>
									<img
										className="pointy"
										src={`/app_static/img/logo30.png`}
										height={"19px"}
										width={"34px"}
										alt="logo30"
										onClick={() => {
											setShowDomainMenu(false);
											window.location.replace(item.url);
										}}
									/>
									<span
										className="domainItem pointy"
										onClick={() => {
											setShowDomainMenu(false);
											window.location.replace(item.url);
										}}
									>
										{item.name}
									</span>
									<span
										className="closeIcon pointy"
										onClick={() => setShowDomainMenu(false)}
									>
										<KeyboardArrowUpIcon
											sx={{ color: "#8B8B8B", width: 20, height: 20 }}
										/>
									</span>
								</div>
							) : (
								<span
									className="domainItem"
									key={item.id}
									style={{ paddingTop: 12, paddingBottom: 12 }}
									onClick={() => {
										setShowDomainMenu(false);
										window.location.replace(item.url);
									}}
								>
									{item.name}
								</span>
							)
						)}
						<span className="horizontalBar" />
						{secondMenu.map((item) => (
							<span
								key={item.id}
								className="domainItem"
								style={{
									paddingTop: item.id === 0 ? 0 : 12,
									paddingBottom: 12,
								}}
								onClick={() => {
									setShowDomainMenu(false);
									window.open(item.url);
								}}
							>
								{item.name}
							</span>
						))}
					</div>
				</Modal>
			)}
		</Box>
	);
}

export default DomainMenu;
