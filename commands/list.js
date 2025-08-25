import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import figlet from "figlet";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 🔹 Helper to render figlet banner
function renderFiglet(text, font = "Standard") {
    return new Promise((resolve, reject) => {
        figlet.text(text, { font }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

export default async function list() {
    try {
        const banner = await renderFiglet("Available Components", "doom");
        console.log(chalk.cyan(banner));

        const templatesDir = path.resolve(__dirname, "../templates");

        if (!(await fs.pathExists(templatesDir))) {
            console.log(chalk.red("❌ No templates directory found."));
            return;
        }

        const components = await fs.readdir(templatesDir);

        if (!components.length) {
            console.log(chalk.yellow("⚠️  No components found in templates/"));
            return;
        }

        console.log(chalk.green("📦 Components available:\n"));

        for (const comp of components) {
            const metaPath = path.join(templatesDir, comp, "meta.json");

            if (await fs.pathExists(metaPath)) {
                const meta = await fs.readJson(metaPath);
                console.log(
                    chalk.blueBright(`🔹 ${meta.name} `) +
                    chalk.gray(`(v${meta.version}) - ${meta.description}`)
                );
            } else {
                console.log(chalk.magenta(`🔹 ${comp}`) + chalk.red(" (no meta.json)"));
            }
        }

        console.log(
            chalk.cyan(
                "\n👉 Use `scaffold add <component>` to add one of these to your project."
            )
        );
    } catch (err) {
        console.error(chalk.red("❌ Failed to list components:"), err);
    }
}
