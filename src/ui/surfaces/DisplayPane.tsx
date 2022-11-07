import clsx from "clsx";
import { Section, DoubleItemSlot } from "ui/components";

import { SimulationState } from "core/SimulationState";
import InGameBackground from "assets/InGame.png";

import React, { useMemo } from "react";
import { ItemList } from "ui/components/item/ItemList";
import { CrashScreen } from "ui/surfaces/CrashScreen";
import { useRuntime } from "data/runtime";
import { CmdErr, Command } from "core/command/command";
import { CommandTextArea } from "ui/surfaces/CommandTextArea";

type DisplayPaneProps = {
    commandText: string,
	command: Command,
	showGameData: boolean,
    simulationState: SimulationState,
    editCommand: (c: string)=>void
}

export const DisplayPane: React.FC<DisplayPaneProps> = ({
	commandText,
	command,
	showGameData,
	editCommand,
	simulationState,
})=>{
	
	const { setting } = useRuntime();
	const isIconAnimated = setting("animatedIcon");
	const isGameDataInterlaced = setting("interlaceGameData");

	let content: JSX.Element;
	if(simulationState.isCrashed()){
		content =
			<div style={{
				position: "relative",
				height: "100%"
			}}>

				<CrashScreen
					primaryText="The game has crashed"
					secondaryText="(This is NOT a simulator bug)"
				/>

			</div>;

	}else if(isGameDataInterlaced && showGameData){
		content =
			<Section titleText={`Game Data / Visible Inventory (Count=${simulationState.inventoryMCount})`} style={{
				borderTop: "1px solid black",
				boxSizing: "border-box",
				height: "100%",
				overflowY: "auto",
				backgroundImage: `url(${InGameBackground})`,
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				color: "white",
			} }>

				{
					(()=>{
						const doubleSlots: JSX.Element[] = [];
						const gameDataSlots = simulationState.displayableGameData.getDisplayedSlots(isIconAnimated);
						const inventorySlots = simulationState.displayablePouch.getDisplayedSlots(isIconAnimated);
						for(let i=0;i<gameDataSlots.length && i<inventorySlots.length;i++){
							doubleSlots.push(<DoubleItemSlot key={i}
								first={{slot: gameDataSlots[i]}}
								second={{slot: inventorySlots[i]}}
							/>);
						}
						if(gameDataSlots.length>inventorySlots.length){
							for(let i=inventorySlots.length;i<gameDataSlots.length;i++){
								doubleSlots.push(<DoubleItemSlot key={i+inventorySlots.length}
									first={{slot: gameDataSlots[i]}}
								/>);
							}
						}else if(inventorySlots.length > gameDataSlots.length){
							for(let i=gameDataSlots.length;i<inventorySlots.length;i++){
								doubleSlots.push(<DoubleItemSlot key={i + gameDataSlots.length}
									second={{slot: inventorySlots[i]}}
								/>);
							}
						}
						return doubleSlots;
					})()
				}

			</Section>
		;
	}else{
		content =
			<div style={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100%"
			}}>
				{
					showGameData && <Section titleText="Game Data" className="SheikaBackground" style={{
						borderTop: "1px solid black",
						color: "white",
						borderBottom: "1px solid black",
						boxSizing: "border-box",
						flex: 1,
						overflowY: "auto"
					} }>
						<ItemList slots={simulationState.displayableGameData.getDisplayedSlots(isIconAnimated)}/>
					</Section>
				}

				<Section titleText={`Visible Inventory (Count=${simulationState.inventoryMCount})`} style={{
					borderTop: "1px solid black",
					backgroundImage: `url(${InGameBackground})`,
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					boxSizing: "border-box",
					flex: 1,
					overflowY: "auto",
					color: "white"
				} }>
					<ItemList slots={simulationState.displayablePouch.getDisplayedSlots(isIconAnimated)}/>

				</Section>
			</div>;

	}

	return <div id="DisplayPane" style={{
		height: "100%",
		display: "flex",
		flexDirection: "column"
	} }>
		<div style={{
			boxSizing: "border-box",
		} }>
			{/* <div> */}
				<CommandTextArea
					className="MainInput"
					scrollBehavior="expand"
					large
					blocks={[command.codeBlocks]} 
					value={[commandText]} 
					setValue={(v)=>editCommand(v.join(" "))} 
				/>
			{/* </div> */}
			

			

		</div>
		<div style={{
			flexGrow: 1,
			position: "relative"
		}}>
			
			{content}
			{
				command.err.length > 0 && 
				<div className={clsx(
						"TooltipWindow", 
						command.cmdErr === CmdErr.Parse && "TooltipWarn",
						command.cmdErr === CmdErr.Execute && "TooltipError"
					)} style={{
					position: "absolute",
					top: 0,
					right: 0,
					left: 0
				}}>
					{
						command.err.map((error,i)=><p className={clsx("TooltipLine", i==0 && "TooltipHeader")} key={i}>{error}</p>)
					}
				</div>
			}
		</div>
		

	</div>;
};