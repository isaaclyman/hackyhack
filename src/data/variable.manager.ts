class VariableManager {
  private variables: {[name: string]: string} = {}
  
  getVariable(name: string) {
    if (!this.variables.hasOwnProperty(name)) {
      throw new Error(`VariableManager: No variable found with name ${name}.`)
    }

    return this.variables[name]
  }

  setVariable(name: string, value: string) {
    this.variables[name] = value
  }
}

export default new VariableManager()