class VariableManager {
  private variables: {[name: string]: string} = {}
  
  getVariable(name: string): string {
    if (!this.variables.hasOwnProperty(name)) {
      throw new Error(`VariableManager: No variable found with name ${name}.`)
    }

    return this.variables[name]
  }

  interpolate(text: string): string {
    return text.replace(/\$[\w]+\b/g, varname => {
      return this.getVariable(varname)
    })
  }

  setVariable(name: string, value: string): void {
    this.variables[name] = value
  }
}

export default new VariableManager()