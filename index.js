import { REST } from "@discordjs/rest";
import { WebSocketManager } from "@discordjs/ws";
import {
  GatewayDispatchEvents,
  GatewayIntentBits,
  InteractionType,
  MessageFlags,
  Client,
  Routes,
} from "@discordjs/core";
import { SlashCommandBuilder } from "@discordjs/builders";

const token =
  "MTEyMzk1NjYwMDU5MjQwODYxNw.G0F8G6.VE4ehY3NjbsVA9I88aXTCebG-yEb1EIhdOR_8s";

// Create REST and WebSocket managers directly
const rest = new REST({ version: "10" }).setToken(token);

const gateway = new WebSocketManager({
  token,
  intents: GatewayIntentBits.MessageContent,
  rest,
});

// Create a client to emit relevant events.
const client = new Client({ rest, gateway });

export const testCommand = new SlashCommandBuilder()
  .setName("test")
  .setDescription("Test Command");

client.on(
  GatewayDispatchEvents.InteractionCreate,
  async ({ data: interaction, api }) => {
    if (
      interaction.type !== InteractionType.ApplicationCommand ||
      interaction.data.name === "test"
    ) {
      await api.interactions.reply(interaction.id, interaction.token, {
        content: "Pong!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
);

async function main() {
  const commands = [testCommand];
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        "1123956600592408617",
        "1123957327540797531"
      ),
      {
        body: commands,
      }
    );
  } catch (err) {
    console.log(err);
  }
}

main();

// Listen for the ready event
client.once(GatewayDispatchEvents.Ready, () => console.log("Ready!"));

// Start the WebSocket connection.
gateway.connect();
