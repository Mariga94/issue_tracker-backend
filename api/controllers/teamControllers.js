import Team from "../models/teamModel.js";

export const createTeam = async (req, res) => {
  try {
    const { teamName, memberEmail } = req.body;
    const userId = req.userId;
    // console.table(req.body);
    const team = await Team.createTeam(userId, teamName, memberEmail);
     res.status(200).send({ message: "Team successfully created", team: team });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.getAllTeams();
    res.status(200).send(teams);
  } catch (error) {
    console.error(error);
    res.send("Something went wrong!").status(500);
  }
};

export const getTeam = async (req, res) => {
  try {
    const id = req.params.id;
    console.table(id);
    const team = await Team.getTeam(id);
    if (!team) {
      res.status(400).json({ message: "Team not available" });
    }
    res.status(200).send(team);
  } catch (error) {
    res.status(500).send("Something went wrong!");
  }
};

// export const AddTeamMember =  async (req, res) => {
//   try {
//     const {id, email} = req.body;
//     console.log(req.body)
//     // const newMember = await Team.AddTeamMember(id, email);
//     res.status(201).send(newMember)
//   } catch (error) {
//     res.status(500).send("Something is wrong");
//   }
// }