"use client";
import supabase from "../lib/supabase";
export default function Home() {
  //return (
    // Тест 1: Провера да ли се Supabase клијент учитао
  console.log('Supabase:', supabase)

  // Тест 2: Дохват података из базе
  const testDb = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .limit(1)
    
    console.log('Подаци:', data)
    console.log('Грешка:', error)
  }

  return (
    <div>
      <h1>Тест Супабасе</h1>
      <button onClick={testDb}>Тестирај базу</button>
    </div>
  )
}
