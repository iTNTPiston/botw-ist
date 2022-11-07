import { createMockItemSearch, createMockItems } from "data/item/TestHelpers";
import { CommandInitialize } from "./parse.initialize";
import { ItemStackArg } from "./ItemStackArg";
import { parseCommand } from "./parsev2";
import { CmdErr, ErrorCommand } from "./command";

describe("core/command/parse.initialize", ()=>{
    const MockItems = createMockItems([
        "MaterialA",
        "MaterialB",
        "MaterialC",
        "Weapon1"
    ]);
    const mockSearchItem = createMockItemSearch(MockItems);
    it("parses hint when failed", ()=>{
        expect("initialize ???").toParseIntoCommand(mockSearchItem, CmdErr.AST);
    });
    it("parses empty items", ()=>{
        expect("initialize").toParseIntoCommand(mockSearchItem, new CommandInitialize([], []));
    });
    it("parses single item", ()=>{
        expect("initialize Material A").toParseIntoCommand(mockSearchItem, new CommandInitialize([
            new ItemStackArg(MockItems["materiala"].createDefaultStack(), 1)
        ], []));
    });
    it("parses list of items", ()=>{
        expect("initialize 1 Material A 2 Material B 3 Material C").toParseIntoCommand(mockSearchItem, new CommandInitialize([
            new ItemStackArg(MockItems["materiala"].createDefaultStack(), 1),
            new ItemStackArg(MockItems["materialb"].createDefaultStack(), 2),
            new ItemStackArg(MockItems["materialc"].createDefaultStack(), 3)
        ], []));
    });
    it("parses list of items with meta", ()=>{
        expect("initialize 1 Material A 2 Material B 1 weapon1 [equip]").toParseIntoCommand(mockSearchItem, new CommandInitialize([
            new ItemStackArg(MockItems["materiala"].createDefaultStack(), 1),
            new ItemStackArg(MockItems["materialb"].createDefaultStack(), 2),
            new ItemStackArg(MockItems["weapon1"].createDefaultStack().modifyMeta({equip: true}), 1)
        ], []));
    });
    it("parses repeated as separate slots", ()=>{
        expect("initialize 2 materialb 2 materialb").toParseIntoCommand(mockSearchItem, new CommandInitialize([
            new ItemStackArg(MockItems["materialb"].createDefaultStack(), 2),
            new ItemStackArg(MockItems["materialb"].createDefaultStack(), 2),
        ], []));
    });
    
});