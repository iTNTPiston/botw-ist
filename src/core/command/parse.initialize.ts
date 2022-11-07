import { SimulationState } from "core/SimulationState";
import { arrayEqual } from "data/util";
import { ASTCommandInitialize } from "./ast/";
import { AbstractProperCommand, Command } from "./command";
import { processWrappers } from "./helper";
import { ItemStackArg } from "./ItemStackArg";
import { parseASTItems } from "./parse.item";
import { codeBlockFromRangeObj, CodeBlockTree, delegateParseItem, ParserItem } from "./type";

export class CommandInitialize extends AbstractProperCommand {
	private stacks: ItemStackArg[];
	constructor(stacks: ItemStackArg[], codeBlocks: CodeBlockTree){
		super(codeBlocks);
		this.stacks = stacks;
	}

	public execute(state: SimulationState): void {
		state.initialize(processWrappers(this.stacks));
	}

	public equals(other: Command): boolean {
		return other instanceof CommandInitialize && arrayEqual(this.stacks, other.stacks);
	}

}

export const parseASTCommandInitialize: ParserItem<ASTCommandInitialize, CommandInitialize> = (ast, search) => {
    const codeBlocks: CodeBlockTree = [];
    codeBlocks.push(codeBlockFromRangeObj(ast.mLiteralInitialize0, "keyword.command"));
    return delegateParseItem(ast.mZeroOrMoreItems1, search, parseASTItems, (i,c)=>new CommandInitialize(i,c), codeBlocks);
}