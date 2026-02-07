import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

function Dashboard({ user, onSignOut }) {
  const [showNewGameForm, setShowNewGameForm] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [playerToAdd, setPlayerToAdd] = useState("");
  const [allUsers, setAllUsers] = useState([])

  const MIN_PLAYERS = 2;
  const MAX_PLAYERS = 6;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();

  }, []);

  const onClickNewGame = () => setShowNewGameForm(true);

  const handleRemovePlayer = (id) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p.id !== id));
  };

  const handleCreateGame = (e) => {
    e.preventDefault();
    if (selectedPlayers.length < MIN_PLAYERS) {
      alert(`Es necessiten almenys ${MIN_PLAYERS} jugadors`);
      return;
    }
    else if (selectedPlayers.length > MAX_PLAYERS) {
      alert(`Es poden escollir un máxim de ${MAX_PLAYERS} jugadors`);
      return;
    }

    const newGame = {
      createdAt: new Date(),
      players: selectedPlayers,
    };

    console.log(newGame)

    createGameInFirebase()

    setSelectedPlayers([]);
    setShowNewGameForm(false);
  };

  const actions = [
    { id: 1, label: "Nova partida", onClick: onClickNewGame },
    { id: 2, label: "Unir-se a una partida", onClick: () => {} },
  ];

  async function createGameInFirebase() {
    try {
      const playersData = selectedPlayers.map((p) => ({
        id: p.id,
        rounds: [],
      }));

      const newGame = {
        createdAt: serverTimestamp(),
        players: playersData,
      };

      const docRef = await addDoc(collection(db, "games"), newGame);
      console.log("Partida creada con ID:", docRef.id);

    } catch (error) {
      console.error("Error creando partida:", error);
      throw error;
    }
}

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 relative">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <div className="text-lg font-semibold text-gray-800">
          <span className="font-bold">{user.displayName}</span>
        </div>

        <button
          onClick={onSignOut}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          Sortir
        </button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="w-full max-w-sm rounded-xl bg-blue-500 py-3 text-white font-medium hover:bg-blue-600 active:scale-95"
          >
            {action.label}
          </button>
        ))}
      </main>

      {showNewGameForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Crear nova partida</h2>

            <form onSubmit={handleCreateGame} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Afegir jugador:</label>
                <div className="flex gap-2">
                  <select
                    value={playerToAdd}
                    onChange={(e) => {
                      const id = e.target.value;
                      setPlayerToAdd(id);

                      if (!id) return;

                      const player = allUsers.find((u) => u.id === id);
                      if (player && !selectedPlayers.some((p) => p.id === player.id)) {
                        setSelectedPlayers([
                          ...selectedPlayers,
                          { ...player, rounds: [], totalPoints: 0 },
                        ]);
                        setPlayerToAdd("");
                      }
                    }}
                    className="border px-3 py-2 rounded flex-1"
                  >
                    <option value="">Selecciona un jugador</option>
                    {allUsers
                      .filter((u) => !selectedPlayers.some((p) => p.id === u.id))
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                {selectedPlayers.length > 0 && (
                  <ul className="space-y-1">
                    {selectedPlayers.map((p) => (
                      <li
                        key={p.id}
                        className="flex justify-between items-center border px-3 py-1 rounded"
                      >
                        {p.name}
                        <button
                          type="button"
                          onClick={() => handleRemovePlayer(p.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewGameForm(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Crear partida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
