import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Direct file path (adjust according to your system)
const filePath = path.resolve('./public/teamdata.json');

interface Team {
  name: string;
  time: string;
}

export async function POST(req: Request) {
  try {
    const data: Team = await req.json();

    // Ensure the file exists and is initialized
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }

    // Read existing data
    const existingData = fs.readFileSync(filePath, 'utf-8');
    const teamData: Team[] = existingData ? JSON.parse(existingData) : [];

    // Check if the team already exists
    const teamExists = teamData.some((team: Team) => team.name === data.name);
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
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
