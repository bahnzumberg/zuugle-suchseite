import React from "react";
import { Box, Modal, Typography } from "@mui/material";
import { getDomainText } from "../../utils/globals";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const listOfDomains = [
	{
		id: 0,
		name: "Zuugle.at",
	},
	{
		id: 1,
		name: "Zuugle.de",
	},
	{
		id: 2,
		name: "Zuugle.ch",
	},
	{
		id: 3,
		name: "Zuugle.it",
	},
	{
		id: 4,
		name: "Zuugle.fr",
	},
	{
		id: 5,
		name: "Zuugle.si",
	},
];

const secondMenu = [
	{ id: 0, name: "Über Zuugle" },
	{ id: 1, name: "Impressum" },
	{ id: 2, name: "Datenschutz" },
];
function DomainMenu() {
	const [showDomainMenu, setShowDomainMenu] = React.useState(false);
	const [activeDomain, setActiveDomain] = React.useState("");

	return (
		<Box comoponent={"div"} className="colLeft">
			<div
				className="countrySwitch rowing"
				onClick={() => setShowDomainMenu(true)}
			>
				<img
					src={`/app_static/img/logo-white.png`}
					height={"19px"}
					width={"34px"}
				/>
				<Typography
					style={{
						fontSize: "15.4px",
						color: "#FFF",
						lineHeight: "21px",
						// marginLeft: "5px",
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
						{listOfDomains.map((item) =>
							// getDomainText() === item.name
							item.name === "Zuugle.at" ? (
								<div
									className="rowing"
									key={item.id}
									style={{ paddingTop: 12, paddingBottom: 12 }}
									onClick={() => setShowDomainMenu(false)}
								>
									<img
										src={`/app_static/img/logo30.png`}
										height={"19px"}
										width={"34px"}
									/>
									<span className="domainItem">{item.name}</span>
									<span
										className="closeIcon"
										// onClick={() => setShowDomainMenu(false)}
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
									onClick={() => setShowDomainMenu(false)}
								>
									{item.name}
								</span>
							)
						)}
						<span className="horizontalBar" />
						{secondMenu.map((item) => (
							<span
								className="domainItem"
								style={{
									paddingTop: item.id === 0 ? 0 : 12,
									paddingBottom: 12,
								}}
								onClick={() => setShowDomainMenu(false)}
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
