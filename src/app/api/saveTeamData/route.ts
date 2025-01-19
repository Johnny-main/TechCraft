import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'teamdata.json');

// Define a type for the team object
interface Team {
  name: string;
  time: string;
}

export async function POST(req: Request) {
  try {
    const data: Team = await req.json(); // Specify the type for the incoming data

    // Read existing data
    let teamData: Team[] = []; // Use the Team type for the array
    if (fs.existsSync(filePath)) {
      const existingData = fs.readFileSync(filePath, 'utf-8');
      teamData = existingData ? JSON.parse(existingData) : [];
    }

    // Check if the team already exists
    const teamExists = teamData.some((team: Team) => team.name === data.name); // Specify 'team' as of type 'Team'
    if (teamExists) {
      return NextResponse.json(
        { message: 'Team already exists' },
        { status: 200 }
      );
    }

    // Append new data
    teamData.push(data);
    fs.writeFileSync(filePath, JSON.stringify(teamData, null, 2));

    return NextResponse.json({ message: 'Data saved successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
