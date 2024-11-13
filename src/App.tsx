import { useState, useEffect } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts';
import { Attributes, Class } from './types';

interface Character {
  id: number;
  name: string;
  attributes: Attributes;
  skills: Record<string, number>;
  selectedClass: Class | null;
}

function App() {
  const API_BASE_URL = 'https://recruiting.verylongdomaintotestwith.ca/api/{bgwyllie}/character';
  const [characters, setCharacters] = useState<Character[]>([])

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch(API_BASE_URL)
        if (response.ok) {
          const data = await response.json()
          setCharacters(data)
        } else {
          console.error("Failed to fetch characters")
        }
      } catch (error) {
        console.error("Error while fetching characters:", error)
      }
    }
    fetchCharacters()
  }, [])
  // initialize the attributes to 10
  const [attributes, setAttributes] = useState<Attributes>({
    Strength: 10,
    Dexterity: 10,
    Constitution: 10,
    Intelligence: 10,
    Wisdom: 10,
    Charisma: 10,
  });

  const calculateModifier = (value: number) => {
    return Math.floor((value - 10) / 2)
  }
  // functions to increment/decrement counter
  const increment = (attr: keyof Attributes) => {
    setAttributes(prevAttributes => {
      const newAttributes = { ...prevAttributes, [attr]: prevAttributes[attr] + 1 }
      const total = Object.values(newAttributes).reduce((acc, curr) => acc + curr, 0)
      return total <= 70 ? newAttributes : prevAttributes
    })
  }
  const decrement = (attr: keyof Attributes) => {
    setAttributes(prevAttributes => {
      const newAttributes = { ...prevAttributes, [attr]: prevAttributes[attr] - 1 }
      return newAttributes[attr] >= 0 ? newAttributes : prevAttributes
    })
  }
  //class related functions
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const handleClassClick = (className: Class) => {
    setSelectedClass(className)
  }
  const meetsClassReqs = (className: string) => {
    const classReqs = CLASS_LIST[className].requirements
    return Object.keys(classReqs).every(attr =>
      attributes[attr as keyof Attributes] >= classReqs[attr]
    )
  }
  //skill related functions
  const [skillPoints, setSkillPoints] = useState<Record<string, number>>(
    SKILL_LIST.reduce((acc, skill) => ({ ...acc, [skill.name]: 0 }), {})
  );
  const availableSkillPoints = 10 + (4 * calculateModifier(attributes.Intelligence));

  const totalPointsSpent = Object.values(skillPoints).reduce((acc, curr) => acc + curr, 0);
  const incrementSkill = (skillName: string) => {
    if (totalPointsSpent < availableSkillPoints) {
      setSkillPoints(prev => ({ ...prev, [skillName]: prev[skillName] + 1 }))
    }
  }
  const decrementSkill = (skillName: string) => {
    if (totalPointsSpent < availableSkillPoints) {
      setSkillPoints(prev => ({ ...prev, [skillName]: prev[skillName] + 1 }))
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise - Rebecca Wyllie</h1>
      </header>
      <section className="App-section">
        {/* Buttons from video: Add New Character Reset All Characters Save All Characters */}
        <header>
          <h2>Skill Check Results</h2>
        </header>
        <div>
          {/* from video: <h3>Character:{selectedCharacter.name}</h3>
          <p>Skill:{selectedCharacter.skillCheckResults.skill}</p>
          <p>You Rolled:{selectedCharacter.skillCheckResults.rolled}</p>
          <p>The DC was:{selectedCharacter.skillCheckResults.dc}</p>
          <p>Result:{selectedCharacter.skillCheckResults.result}</p> */}
        </div>

      </section>
      <section className="App-section">
        <header>
          <h2>Character 1</h2>
        </header>
        <header>
          <h2>Skill Check</h2>
        </header>

        <div className="main-grid-container">

          <div className="grid-item">
            <header>
              <h2>Attributes</h2>
            </header>
            {ATTRIBUTE_LIST.map((attr) => (
              <div key={attr}>
                <span>
                  {attr}: {attributes[attr]}
                  (Modifier: {calculateModifier(attributes[attr])})
                  <button onClick={() => increment(attr)}>+</button>
                  <button onClick={() => decrement(attr)}>-</button>
                </span>
              </div>
            ))}
          </div>


          <div className="grid-item">
            <header>
              <h2>Classes</h2>
            </header>
            {Object.keys(CLASS_LIST).map((cls) => (
              <div key={cls}
                onClick={() => handleClassClick(cls as Class)}
                style={{ cursor: 'pointer' }}
              >
                {cls}
              </div>
            ))}
          </div>

          {selectedClass && (
            <div>
              <h3>Selected Class: {selectedClass}</h3>
              <p>Minimum Required Stats</p>

              {Object.entries(CLASS_LIST[selectedClass]).map(([attr, value]) => (
                <li key={attr}>{`${attr}:${value}`}</li>
              ))}

            </div>
          )}


          <div className="grid-item">
            <header>
              <h2>Skills</h2>
            </header>
            <div>Total skill points available: {availableSkillPoints - totalPointsSpent}</div>
            {SKILL_LIST.map((skill => {
              const attributePointModifier = calculateModifier(attributes[skill.attributeModifier as keyof Attributes])
              const totalSkillPoints = skillPoints[skill.name] + attributePointModifier

              return (
                <div key={skill.name}>
                  {skill.name} - points: {skillPoints[skill.name]}
                  <button onClick={() => incrementSkill(skill.name)}>+</button>
                  <button onClick={() => decrementSkill(skill.name)}>-</button>
                  modifier({skill.attributeModifier}):{attributePointModifier} total:{totalSkillPoints}
                </div>
              )
            }

            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
