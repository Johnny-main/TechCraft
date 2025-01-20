import { NextResponse } from 'next/server';

interface Team {
  name: string;
  time: string;
}

// In-memory storage for team data
let teamData: Team[] = [];

export async function POST(req: Request) {
  try {
    const data: Team = await req.json();

    // Check if the team already exists
    const teamExists = teamData.some((team) => team.name === data.name);
    if (teamExists) {
      return NextResponse.json(
        { message: 'Team already exists' },
        { status: 200 }
      );
    }

    // Add new team to memory
    teamData.push(data);

    return NextResponse.json({ message: 'Data saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Return the current team data
    return NextResponse.json(teamData, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
